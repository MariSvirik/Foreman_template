import * as React from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  Level,
  LevelItem,
  MenuToggle,
  MenuToggleCheckbox,
  PageSection,
  Pagination,
  PaginationVariant,
  SearchInput,
  Text,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { BookmarkIcon, EllipsisVIcon } from '@patternfly/react-icons';
import {
  ExpandableRowContent,
  ISortBy,
  SortByDirection,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { ALL_ERRATA_ROWS, type ErrataRow } from '@app/Errata/errataData';
import { ErrataSeverityIconLabel, ErrataTypeIconLabel } from '@app/Errata/errataVisuals';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useNavigate } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

type ErrataTypeFilter = 'all' | 'bugfix' | 'security';
type SeverityFilter = 'all' | 'na' | 'moderate' | 'important';

/** Matches reference UI: e.g. 07 Apr 2026 */
function formatPublishDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const BOOKMARK_ICON_COLOR = '#151515';

/** Column indices: expand, select, Name, Synopsis, Type, Severity, Affected systems, Reboot, Published, actions */
const COL = {
  name: 2,
  synopsis: 3,
  type: 4,
  severity: 5,
  affected: 6,
  reboot: 7,
  published: 8,
} as const;

const affectedSystemsCell = (row: ErrataRow, onNavigate: () => void) => {
  const n = row.affectedSystems ?? row.applicable;
  return (
    <Button variant="link" isInline onClick={onNavigate}>
      {n}
    </Button>
  );
};

const ErrataIndex: React.FunctionComponent = () => {
  useDocumentTitle('PatternFly Seed | Errata');
  const navigate = useNavigate();

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  /** Draft text in the search field (updates on every keystroke). */
  const [searchDraft, setSearchDraft] = React.useState('');
  /** Value used to filter the table (updated on submit — see SearchInput with submit in PF5). */
  const [searchQuery, setSearchQuery] = React.useState('');
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [savedOpen, setSavedOpen] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<ErrataTypeFilter>('all');
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [severityFilter, setSeverityFilter] = React.useState<SeverityFilter>('all');
  const [severityOpen, setSeverityOpen] = React.useState(false);
  const [toolbarKebabOpen, setToolbarKebabOpen] = React.useState(false);
  const [rowActionId, setRowActionId] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<ISortBy>({ index: COL.published, direction: 'desc' });

  const filtered = React.useMemo(() => {
    let rows = [...ALL_ERRATA_ROWS];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.errataId.toLowerCase().includes(q) ||
          r.synopsis.toLowerCase().includes(q) ||
          r.severityLabel.toLowerCase().includes(q) ||
          String(r.applicable).includes(q) ||
          String(r.installable).includes(q),
      );
    }
    if (typeFilter !== 'all') {
      rows = rows.filter((r) => r.errataType === typeFilter);
    }
    if (severityFilter !== 'all') {
      rows = rows.filter((r) => {
        if (severityFilter === 'na') {
          return r.severityLabel === 'N/A' || r.severityLabel === 'None';
        }
        if (severityFilter === 'moderate') {
          return r.severityLabel === 'Moderate';
        }
        if (severityFilter === 'important') {
          return r.severityLabel === 'Important';
        }
        return true;
      });
    }

    const dir = sortBy.direction === 'asc' ? 1 : -1;
    const idx = sortBy.index ?? COL.name;
    rows.sort((a, b) => {
      let cmp = 0;
      switch (idx) {
        case COL.name:
          cmp = a.errataId.localeCompare(b.errataId);
          break;
        case COL.synopsis:
          cmp = a.synopsis.localeCompare(b.synopsis);
          break;
        case COL.type:
          cmp = a.errataType.localeCompare(b.errataType);
          break;
        case COL.severity:
          cmp = a.severityLabel.localeCompare(b.severityLabel);
          break;
        case COL.affected:
          cmp = (a.affectedSystems ?? a.applicable) - (b.affectedSystems ?? b.applicable);
          break;
        case COL.reboot:
          cmp = Number(a.rebootRequired) - Number(b.rebootRequired);
          break;
        case COL.published:
          cmp = a.publishedSort - b.publishedSort;
          break;
        default:
          cmp = 0;
      }
      return cmp * dir;
    });

    return rows;
  }, [searchQuery, typeFilter, severityFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const idsOnPage = slice.map((r) => r.id);
  const allOnPageSelected = idsOnPage.length > 0 && idsOnPage.every((id) => selected.has(id));
  const partiallySelected = idsOnPage.some((id) => selected.has(id)) && !allOnPageSelected;
  const bulkCheck: boolean | null = allOnPageSelected ? true : partiallySelected ? null : false;

  const selectAllFiltered = (checked: boolean) => {
    setSelected(checked ? new Set(filtered.map((r) => r.id)) : new Set());
  };

  const selectPage = () => {
    const next = new Set(selected);
    idsOnPage.forEach((id) => next.add(id));
    setSelected(next);
  };

  const toggleRow = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelected(next);
  };

  const onSort = React.useCallback(
    (_e: React.MouseEvent, columnIndex: number, direction: SortByDirection) => {
      setSortBy({ index: columnIndex, direction });
      setPage(1);
    },
    [],
  );

  const toggleExpand = (id: string, isOpen: boolean) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (isOpen) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const expandAll = slice.length > 0 && slice.every((r) => expanded.has(r.id));
  const itemCount = filtered.length;

  const paginationTitles = {
    paginationAriaLabel: 'Errata pagination',
    toFirstPageAriaLabel: 'Go to first page',
    toLastPageAriaLabel: 'Go to last page',
    toNextPageAriaLabel: 'Go to next page',
    toPreviousPageAriaLabel: 'Go to previous page',
    optionsToggleAriaLabel: 'Items per page',
    currPageAriaLabel: 'Current page',
  };

  return (
    <PageSection
      aria-label="Errata list"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      <div
        style={{
          paddingTop: spacingL,
          paddingRight: spacingL,
          paddingBottom: spacingMd,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Level hasGutter>
          <LevelItem>
            <TextContent>
              <Title headingLevel="h1" size="2xl">
                Errata
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </div>

      <div
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
        }}
      >
        <Toolbar
          id="errata-toolbar"
          ouiaId="errata-toolbar"
          inset={{ default: 'insetNone' }}
          style={{
            marginBottom: spacingMd,
            padding: 0,
            rowGap: 0,
          }}
        >
          <ToolbarContent
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              paddingBlock: 0,
            }}
          >
            <ToolbarGroup>
              <ToolbarItem>
                <Dropdown
                  isOpen={bulkOpen}
                  onSelect={() => setBulkOpen(false)}
                  onOpenChange={setBulkOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setBulkOpen(!bulkOpen)}
                      isExpanded={bulkOpen}
                      splitButtonOptions={{
                        items: [
                          <MenuToggleCheckbox
                            key="bulk"
                            id="errata-bulk"
                            aria-label="Select all"
                            isChecked={bulkCheck}
                            onChange={(checked) => selectAllFiltered(checked)}
                          />,
                        ],
                      }}
                      aria-label="Bulk select"
                    />
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="none" onClick={() => selectAllFiltered(false)}>
                      Select none ({filtered.length} items)
                    </DropdownItem>
                    <DropdownItem key="page" onClick={() => selectPage()}>
                      Select page ({slice.length} items)
                    </DropdownItem>
                    <DropdownItem key="all" onClick={() => selectAllFiltered(true)}>
                      Select all ({filtered.length} items)
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              <ToolbarItem>
                <Flex
                  alignItems={{ default: 'alignItemsStretch' }}
                  spaceItems={{ default: 'spaceItemsNone' }}
                  style={{ flex: 1, minWidth: 280, maxWidth: 560 }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <SearchInput
                      placeholder="Search"
                      value={searchDraft}
                      onChange={(_e, v) => setSearchDraft(v)}
                      onClear={() => {
                        setSearchDraft('');
                        setSearchQuery('');
                        setPage(1);
                      }}
                      onSearch={(_e, value) => {
                        setSearchQuery(value);
                        setPage(1);
                      }}
                      aria-label="Search errata"
                    />
                  </div>
                  <Dropdown
                    isOpen={savedOpen}
                    onSelect={() => setSavedOpen(false)}
                    onOpenChange={setSavedOpen}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        variant="plain"
                        onClick={() => setSavedOpen(!savedOpen)}
                        isExpanded={savedOpen}
                        aria-label="Saved filters"
                        icon={<BookmarkIcon color={BOOKMARK_ICON_COLOR} />}
                      />
                    )}
                    popperProps={{ appendTo: () => document.body }}
                  >
                    <DropdownList>
                      <DropdownItem key="s1">Last week security</DropdownItem>
                      <DropdownItem key="s2">Installable only</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Flex>
              </ToolbarItem>

              <ToolbarItem>
                <Dropdown
                  isOpen={typeOpen}
                  onSelect={() => setTypeOpen(false)}
                  onOpenChange={setTypeOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setTypeOpen(!typeOpen)}
                      isExpanded={typeOpen}
                    >
                      Type
                      {typeFilter !== 'all' ? `: ${typeFilter === 'bugfix' ? 'Bugfix' : 'Security'}` : ''}
                    </MenuToggle>
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="all" onClick={() => { setTypeFilter('all'); setPage(1); }}>
                      All types
                    </DropdownItem>
                    <DropdownItem key="bf" onClick={() => { setTypeFilter('bugfix'); setPage(1); }}>
                      Bugfix
                    </DropdownItem>
                    <DropdownItem key="sec" onClick={() => { setTypeFilter('security'); setPage(1); }}>
                      Security
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              <ToolbarItem>
                <Dropdown
                  isOpen={severityOpen}
                  onSelect={() => setSeverityOpen(false)}
                  onOpenChange={setSeverityOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setSeverityOpen(!severityOpen)}
                      isExpanded={severityOpen}
                    >
                      Severity
                      {severityFilter !== 'all'
                        ? `: ${severityFilter === 'na' ? 'N/A' : severityFilter === 'moderate' ? 'Moderate' : 'Important'}`
                        : ''}
                    </MenuToggle>
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="all" onClick={() => { setSeverityFilter('all'); setPage(1); }}>
                      All
                    </DropdownItem>
                    <DropdownItem key="na" onClick={() => { setSeverityFilter('na'); setPage(1); }}>
                      N/A
                    </DropdownItem>
                    <DropdownItem key="mod" onClick={() => { setSeverityFilter('moderate'); setPage(1); }}>
                      Moderate
                    </DropdownItem>
                    <DropdownItem key="imp" onClick={() => { setSeverityFilter('important'); setPage(1); }}>
                      Important
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              <ToolbarItem>
                <MenuToggle
                  variant="primary"
                  isDisabled
                  aria-label="Apply (disabled)"
                  splitButtonOptions={{
                    variant: 'action',
                    items: [
                      <Button key="apply-action" variant="primary" isDisabled>
                        Apply
                      </Button>,
                    ],
                  }}
                />
              </ToolbarItem>

              <ToolbarItem>
                <Dropdown
                  isOpen={toolbarKebabOpen}
                  onSelect={() => setToolbarKebabOpen(false)}
                  onOpenChange={setToolbarKebabOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      variant="plain"
                      onClick={() => setToolbarKebabOpen(!toolbarKebabOpen)}
                      isExpanded={toolbarKebabOpen}
                      aria-label="Toolbar actions"
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="export">Export</DropdownItem>
                    <DropdownItem key="col">Manage columns</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup align={{ default: 'alignRight' }}>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={itemCount}
                  perPage={perPage}
                  page={safePage}
                  onSetPage={(_e, nextPage) => setPage(nextPage)}
                  onPerPageSelect={(_e, nextPerPage, nextPage) => {
                    setPerPage(nextPerPage);
                    setPage(nextPage);
                  }}
                  variant={PaginationVariant.top}
                  titles={paginationTitles}
                  toggleTemplate={({ firstIndex, lastIndex, itemCount: total }) => (
                    <span>
                      {firstIndex} - {lastIndex} of {total}
                    </span>
                  )}
                  isCompact
                  ouiaId="errata-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Errata" variant="compact" borders ouiaId="errata-table" style={{ marginBottom: 0 }}>
          <Thead>
            <Tr>
              <Th
                screenReaderText="Expand row"
                expand={
                  slice.length > 0
                    ? {
                        areAllExpanded: expandAll,
                        onToggle: (_e, _rowIndex, isOpen) => {
                          if (isOpen) {
                            setExpanded(new Set(slice.map((r) => r.id)));
                          } else {
                            setExpanded((prev) => {
                              const next = new Set(prev);
                              slice.forEach((r) => next.delete(r.id));
                              return next;
                            });
                          }
                        },
                        collapseAllAriaLabel: 'Collapse all rows',
                      }
                    : undefined
                }
              />
              <Th screenReaderText="Select row" />
              <Th sort={{ columnIndex: COL.name, sortBy, onSort }}>Name</Th>
              <Th sort={{ columnIndex: COL.synopsis, sortBy, onSort }}>Synopsis</Th>
              <Th sort={{ columnIndex: COL.type, sortBy, onSort }}>Type</Th>
              <Th sort={{ columnIndex: COL.severity, sortBy, onSort }}>Severity</Th>
              <Th sort={{ columnIndex: COL.affected, sortBy, onSort }}>Affected systems</Th>
              <Th sort={{ columnIndex: COL.reboot, sortBy, onSort }}>Reboot required</Th>
              <Th sort={{ columnIndex: COL.published, sortBy, onSort }}>Publish date</Th>
              <Th screenReaderText="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            {slice.map((row, rowIndex) => {
              const isEx = expanded.has(row.id);
              return (
                <React.Fragment key={row.id}>
                  {/*
                    PF Tr hides the row when `isExpanded={false}` (see Tr.tsx: isExpanded !== undefined && !isExpanded).
                    Only pass isExpanded when expanded so the main row stays visible when collapsed.
                  */}
                  <Tr isExpanded={isEx ? true : undefined}>
                    <Td
                      expand={{
                        isExpanded: isEx,
                        rowIndex,
                        onToggle: (_e, _rIdx, isOpen) => toggleExpand(row.id, isOpen),
                      }}
                    />
                    <Td
                      select={{
                        rowIndex,
                        onSelect: (_e, isSelected) => toggleRow(row.id, isSelected),
                        isSelected: selected.has(row.id),
                        variant: 'checkbox',
                      }}
                    />
                    <Td dataLabel="Name">
                      <Button
                        variant="link"
                        isInline
                        onClick={() => navigate(`/errata/${encodeURIComponent(row.errataId)}`)}
                      >
                        {row.errataId}
                      </Button>
                    </Td>
                    <Td dataLabel="Synopsis" modifier="truncate">
                      {row.synopsis}
                    </Td>
                    <Td dataLabel="Type">
                      <ErrataTypeIconLabel row={row} />
                    </Td>
                    <Td dataLabel="Severity">
                      {row.errataType === 'security' ? (
                        <ErrataSeverityIconLabel severityLabel={row.severityLabel} />
                      ) : (
                        '-'
                      )}
                    </Td>
                    <Td dataLabel="Affected systems">
                      {affectedSystemsCell(row, () =>
                        navigate(`/errata/${encodeURIComponent(row.errataId)}`),
                      )}
                    </Td>
                    <Td dataLabel="Reboot required">
                      {row.rebootRequired ? 'Required' : 'Not required'}
                    </Td>
                    <Td dataLabel="Publish date">{formatPublishDate(row.publishedSort)}</Td>
                    <Td isActionCell>
                      <Dropdown
                        isOpen={rowActionId === row.id}
                        onOpenChange={(open) => setRowActionId(open ? row.id : null)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            variant="plain"
                            onClick={() => setRowActionId(rowActionId === row.id ? null : row.id)}
                            isExpanded={rowActionId === row.id}
                            aria-label={`Actions for ${row.errataId}`}
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                        popperProps={{ appendTo: () => document.body }}
                      >
                        <DropdownList>
                          <DropdownItem
                            key="view"
                            onClick={() => navigate(`/errata/${encodeURIComponent(row.errataId)}`)}
                          >
                            View
                          </DropdownItem>
                          <DropdownItem key="apply">Apply</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </Td>
                  </Tr>
                  <Tr isExpanded={isEx} isHidden={!isEx}>
                    <Td colSpan={10}>
                      <ExpandableRowContent>
                        <Text>{row.detail}</Text>
                      </ExpandableRowContent>
                    </Td>
                  </Tr>
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>

        <Pagination
          itemCount={itemCount}
          perPage={perPage}
          page={safePage}
          onSetPage={(_e, nextPage) => setPage(nextPage)}
          onPerPageSelect={(_e, nextPerPage, nextPage) => {
            setPerPage(nextPerPage);
            setPage(nextPage);
          }}
          variant={PaginationVariant.bottom}
          titles={paginationTitles}
          toggleTemplate={({ firstIndex, lastIndex, itemCount: total }) => (
            <span>
              {firstIndex} - {lastIndex} of {total}
            </span>
          )}
          isCompact
          isStatic
          ouiaId="errata-pagination-bottom"
          style={{
            marginTop: 0,
            paddingTop: spacingMd,
            paddingBlockStart: spacingMd,
            paddingLeft: 0,
            paddingRight: 0,
            paddingInline: 0,
          }}
        />
      </div>
    </PageSection>
  );
};

export { ErrataIndex };
