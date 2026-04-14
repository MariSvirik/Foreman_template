import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
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
import { BulkSelect, BulkSelectValue } from '@patternfly/react-component-groups/dist/esm/BulkSelect';
import { EllipsisVIcon } from '@patternfly/react-icons';
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
import { Link, useNavigate } from 'react-router-dom';

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

/** Name / Type / Severity constrained; Synopsis flexes. Auto table layout keeps headers readable. */
const errataNameColStyle: React.CSSProperties = {
  width: '10rem',
  maxWidth: '12rem',
  verticalAlign: 'middle',
};
const errataSynopsisColStyle: React.CSSProperties = {
  minWidth: '24rem',
  width: 'auto',
  verticalAlign: 'middle',
};
/** Type and Severity: same width band; normal cell padding. */
const errataTypeColStyle: React.CSSProperties = {
  width: '8.5rem',
  maxWidth: '10rem',
  verticalAlign: 'middle',
};
const errataSeverityColStyle: React.CSSProperties = {
  width: '8.5rem',
  maxWidth: '10rem',
  verticalAlign: 'middle',
};

/** Sortable headers: avoid truncation at default viewport (table-layout fixed). */
const thHeaderNowrap: React.CSSProperties = {
  whiteSpace: 'nowrap',
};
const thAffectedColStyle: React.CSSProperties = {
  ...thHeaderNowrap,
  minWidth: '9.5rem',
};
const thRebootColStyle: React.CSSProperties = {
  ...thHeaderNowrap,
  minWidth: '8.5rem',
};
const thPublishedColStyle: React.CSSProperties = {
  ...thHeaderNowrap,
  minWidth: '7rem',
};

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
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = React.useState<ErrataTypeFilter>('all');
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [severityFilter, setSeverityFilter] = React.useState<SeverityFilter>('all');
  const [severityOpen, setSeverityOpen] = React.useState(false);
  const [applySplitOpen, setApplySplitOpen] = React.useState(false);
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

  const selectAllFiltered = () => {
    setSelected(new Set(filtered.map((r) => r.id)));
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  const selectPage = () => {
    const next = new Set(selected);
    idsOnPage.forEach((id) => next.add(id));
    setSelected(next);
  };

  const clearPageSelection = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      idsOnPage.forEach((id) => next.delete(id));
      return next;
    });
  };

  const onBulkSelect = (
    value: (typeof BulkSelectValue)[keyof typeof BulkSelectValue],
  ) => {
    switch (value) {
      case BulkSelectValue.none:
        clearSelection();
        break;
      case BulkSelectValue.all:
        selectAllFiltered();
        break;
      case BulkSelectValue.page:
        selectPage();
        break;
      case BulkSelectValue.nonePage:
        clearPageSelection();
        break;
      default:
        break;
    }
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
  const hasSelection = selected.size > 0;

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
      {/* 1. Breadcrumb section (matches Template detail / Errata detail) */}
      <div
        style={{
          paddingTop: spacingMd,
          paddingRight: spacingL,
          paddingBottom: 0,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Breadcrumb>
          <BreadcrumbItem
            to="/content-types"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/content-types" aria-current={ariaCurrent}>
                Content Types
              </Link>
            )}
          />
          <BreadcrumbItem isActive>Errata</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* 2. Title section */}
      <div
        style={{
          paddingTop: spacingMd,
          paddingRight: spacingL,
          paddingBottom: spacingMd,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <TextContent>
          <Title headingLevel="h1" size="2xl">
            Errata
          </Title>
        </TextContent>
      </div>

      {/* 3. Toolbar row — 16px top/bottom padding on the toolbar strip (spacingMd) */}
      <div
        style={{
          paddingTop: spacingMd,
          paddingRight: spacingL,
          paddingBottom: spacingMd,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
          fontSize: '14px',
        }}
      >
        <Toolbar
          id="errata-toolbar"
          ouiaId="errata-toolbar"
          inset={{ default: 'insetNone' }}
          style={{
            marginBottom: 0,
            padding: 0,
            rowGap: 0,
          }}
        >
          <ToolbarContent
            alignItems="center"
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              paddingBlock: 0,
            }}
          >
            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem>
                <BulkSelect
                  ouiaId="errata-bulk-select"
                  isDataPaginated
                  canSelectAll
                  pageCount={slice.length}
                  selectedCount={selected.size}
                  totalCount={filtered.length}
                  pageSelected={allOnPageSelected}
                  pagePartiallySelected={partiallySelected}
                  onSelect={onBulkSelect}
                  popperProps={{ appendTo: () => document.body }}
                  menuToggleCheckboxProps={{
                    id: 'errata-bulk-checkbox',
                    'aria-label':
                      selected.size > 0
                        ? `Select rows, ${selected.size} of ${filtered.length} selected`
                        : 'Select rows',
                  }}
                />
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem style={{ flex: '0 0 auto', width: 360, maxWidth: 'min(480px, 100%)' }}>
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
              </ToolbarItem>
            </ToolbarGroup>

            {/* Type + Severity: one filter group, 8px between toggles */}
            <ToolbarGroup
              variant="filter-group"
              spacer={{ default: 'spacerMd' }}
              spaceItems={{ default: 'spaceItemsSm' }}
            >
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
            </ToolbarGroup>

            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsMd' }}>
              <ToolbarItem>
                <Dropdown
                  isOpen={applySplitOpen}
                  onSelect={() => setApplySplitOpen(false)}
                  onOpenChange={(open) => setApplySplitOpen(open)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      variant="primary"
                      isDisabled={!hasSelection}
                      aria-label={
                        hasSelection
                          ? 'Apply actions menu'
                          : 'Apply actions (select errata first)'
                      }
                      splitButtonOptions={{
                        variant: 'action',
                        items: [
                          <Button
                            key="apply-action"
                            variant="primary"
                            isDisabled={!hasSelection}
                            onClick={(e) => {
                              e.stopPropagation();
                              /* demo: bulk apply would run here */
                            }}
                          >
                            Apply
                          </Button>,
                        ],
                      }}
                      onClick={() => setApplySplitOpen(!applySplitOpen)}
                      isExpanded={applySplitOpen}
                    />
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="apply-remote" isDisabled={!hasSelection}>
                      Apply via remote execution
                    </DropdownItem>
                    <DropdownItem key="add-to-cv" isDisabled={!hasSelection}>
                      Add to content view
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
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
      </div>

      {/* 4. Table and pagination — same horizontal inset as detail tables (tablePadded) */}
      <section
        aria-label="Errata table"
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Table
          aria-label="Errata"
          variant="compact"
          borders
          ouiaId="errata-table"
          className="app-table-expand-header-caret app-table-expand-no-middle-rule"
          isExpandable
          style={{ marginBottom: 0, width: '100%' }}
        >
          <Thead>
            <Tr>
              <Th
                screenReaderText="Expand row"
                expand={
                  slice.length > 0
                    ? {
                        areAllExpanded: expandAll,
                        /** Third arg is current “all rows on this page expanded” (PF passes expanded state, not the next action). */
                        onToggle: (_e, _rowIndex, allExpandedOnPage) => {
                          if (allExpandedOnPage) {
                            setExpanded((prev) => {
                              const next = new Set(prev);
                              slice.forEach((r) => next.delete(r.id));
                              return next;
                            });
                          } else {
                            setExpanded((prev) => {
                              const next = new Set(prev);
                              slice.forEach((r) => next.add(r.id));
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
              <Th sort={{ columnIndex: COL.name, sortBy, onSort }} style={{ ...errataNameColStyle, ...thHeaderNowrap }}>
                Name
              </Th>
              <Th sort={{ columnIndex: COL.synopsis, sortBy, onSort }} style={{ ...errataSynopsisColStyle, ...thHeaderNowrap }}>
                Synopsis
              </Th>
              <Th sort={{ columnIndex: COL.type, sortBy, onSort }} style={{ ...errataTypeColStyle, ...thHeaderNowrap }}>
                Type
              </Th>
              <Th sort={{ columnIndex: COL.severity, sortBy, onSort }} style={{ ...errataSeverityColStyle, ...thHeaderNowrap }}>
                Severity
              </Th>
              <Th sort={{ columnIndex: COL.affected, sortBy, onSort }} style={thAffectedColStyle}>
                Affected systems
              </Th>
              <Th sort={{ columnIndex: COL.reboot, sortBy, onSort }} style={thRebootColStyle}>
                Reboot required
              </Th>
              <Th sort={{ columnIndex: COL.published, sortBy, onSort }} style={thPublishedColStyle}>
                Publish date
              </Th>
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
                  <Tr isExpanded={isEx ? true : undefined} isStriped={rowIndex % 2 === 1}>
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
                    <Td dataLabel="Name" style={errataNameColStyle}>
                      <Button
                        variant="link"
                        isInline
                        onClick={() => navigate(`/errata/${encodeURIComponent(row.errataId)}`)}
                      >
                        {row.errataId}
                      </Button>
                    </Td>
                    <Td dataLabel="Synopsis" modifier="truncate" style={errataSynopsisColStyle}>
                      {row.synopsis}
                    </Td>
                    <Td dataLabel="Type" style={errataTypeColStyle}>
                      <ErrataTypeIconLabel row={row} />
                    </Td>
                    <Td dataLabel="Severity" style={errataSeverityColStyle}>
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
                  <Tr isExpanded={isEx} isHidden={!isEx} isStriped={rowIndex % 2 === 1}>
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
      </section>
    </PageSection>
  );
};

export { ErrataIndex };
