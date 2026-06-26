import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownList,
  InputGroup,
  InputGroupItem,
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
import { EllipsisVIcon, OutlinedBookmarkIcon } from '@patternfly/react-icons';
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { MOCK_PYTHON_PACKAGES } from '@app/PythonPackages/pythonPackageData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { Link } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const thNowrap: React.CSSProperties = { whiteSpace: 'nowrap' };

const PythonPackages: React.FunctionComponent = () => {
  useDocumentTitle('PatternFly Seed | Python Packages');

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [rowActionId, setRowActionId] = React.useState<string | null>(null);
  const [toolbarKebabOpen, setToolbarKebabOpen] = React.useState(false);
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [...MOCK_PYTHON_PACKAGES];
    return MOCK_PYTHON_PACKAGES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.version.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const idsOnPage = slice.map((r) => r.id);
  const allOnPageSelected = idsOnPage.length > 0 && idsOnPage.every((id) => selected.has(id));
  const partiallySelected = idsOnPage.some((id) => selected.has(id)) && !allOnPageSelected;

  const selectAllFiltered = () => setSelected(new Set(filtered.map((r) => r.id)));
  const clearSelection = () => setSelected(new Set());
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
      case BulkSelectValue.none: clearSelection(); break;
      case BulkSelectValue.all: selectAllFiltered(); break;
      case BulkSelectValue.page: selectPage(); break;
      case BulkSelectValue.nonePage: clearPageSelection(); break;
      default: break;
    }
  };

  const toggleRow = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id); else next.delete(id);
    setSelected(next);
  };

  const toggleExpand = (id: string, isOpen: boolean) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(id); else next.delete(id);
      return next;
    });
  };

  const expandAll = slice.length > 0 && slice.every((r) => expanded.has(r.id));
  const itemCount = filtered.length;

  const paginationTitles = {
    paginationAriaLabel: 'Python packages pagination',
    toFirstPageAriaLabel: 'Go to first page',
    toLastPageAriaLabel: 'Go to last page',
    toNextPageAriaLabel: 'Go to next page',
    toPreviousPageAriaLabel: 'Go to previous page',
    optionsToggleAriaLabel: 'Items per page',
    currPageAriaLabel: 'Current page',
  };

  return (
    <PageSection
      aria-label="Python Packages"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: 0, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <Breadcrumb>
          <BreadcrumbItem
            to="/content-types"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/content-types" aria-current={ariaCurrent}>Content Types</Link>
            )}
          />
          <BreadcrumbItem isActive>Python Packages</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: spacingMd, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <TextContent>
          <Title headingLevel="h1" size="2xl">Python Packages</Title>
        </TextContent>
      </div>

      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: spacingMd, paddingLeft: spacingL, boxSizing: 'border-box', fontSize: '14px' }}>
        <Toolbar id="python-packages-toolbar" ouiaId="python-packages-toolbar" inset={{ default: 'insetNone' }} style={{ marginBottom: 0, padding: 0, rowGap: 0 }}>
          <ToolbarContent alignItems="center" style={{ paddingTop: 0, paddingBottom: 0, paddingBlock: 0 }}>
            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem>
                <BulkSelect
                  ouiaId="python-packages-bulk-select"
                  isDataPaginated canSelectAll
                  pageCount={slice.length} selectedCount={selected.size} totalCount={filtered.length}
                  pageSelected={allOnPageSelected} pagePartiallySelected={partiallySelected}
                  onSelect={onBulkSelect}
                  popperProps={{ appendTo: () => document.body }}
                  menuToggleCheckboxProps={{
                    id: 'python-packages-bulk-checkbox',
                    'aria-label': selected.size > 0
                      ? `Select rows, ${selected.size} of ${filtered.length} selected`
                      : 'Select rows',
                  }}
                />
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem style={{ flex: '0 0 auto', width: 420, maxWidth: 'min(560px, 100%)' }}>
                <InputGroup>
                  <InputGroupItem isFill>
                    <SearchInput
                      placeholder="Search"
                      value={searchDraft}
                      onChange={(_e, v) => setSearchDraft(v)}
                      onClear={() => { setSearchDraft(''); setSearchQuery(''); setPage(1); }}
                      onSearch={(_e, value) => { setSearchQuery(value); setPage(1); }}
                      aria-label="Search python packages"
                    />
                  </InputGroupItem>
                  <InputGroupItem>
                    <MenuToggle
                      variant="default" isFullHeight
                      className="app-template-search-bookmark-toggle"
                      onClick={() => setBookmarkOpen(!bookmarkOpen)}
                      isExpanded={bookmarkOpen}
                      aria-label="Search bookmarks"
                      icon={<OutlinedBookmarkIcon />}
                    />
                  </InputGroupItem>
                </InputGroup>
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup spacer={{ default: 'spacerMd' }}>
              <ToolbarItem>
                <Dropdown
                  isOpen={toolbarKebabOpen}
                  onSelect={() => setToolbarKebabOpen(false)}
                  onOpenChange={setToolbarKebabOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle ref={toggleRef} variant="plain" onClick={() => setToolbarKebabOpen(!toolbarKebabOpen)} isExpanded={toolbarKebabOpen} aria-label="Toolbar actions">
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="export">Export</DropdownItem>
                    <DropdownItem key="manage-columns">Manage columns</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup align={{ default: 'alignRight' }}>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={itemCount} perPage={perPage} page={safePage}
                  onSetPage={(_e, p) => setPage(p)}
                  onPerPageSelect={(_e, pp, p) => { setPerPage(pp); setPage(p); }}
                  variant={PaginationVariant.top} titles={paginationTitles}
                  toggleTemplate={({ firstIndex, lastIndex, itemCount: t }) => <span>{firstIndex} - {lastIndex} of {t}</span>}
                  isCompact ouiaId="python-packages-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </div>

      <section aria-label="Python packages table" style={{ paddingTop: 0, paddingRight: spacingL, paddingBottom: spacingL, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <Table aria-label="Python packages" variant="compact" borders ouiaId="python-packages-table" className="app-table-expand-header-caret app-table-expand-no-middle-rule" isExpandable style={{ marginBottom: 0, width: '100%' }}>
          <Thead>
            <Tr>
              <Th screenReaderText="Expand row" expand={slice.length > 0 ? {
                areAllExpanded: expandAll,
                onToggle: (_e, _ri, all) => {
                  if (all) { setExpanded((p) => { const n = new Set(p); slice.forEach((r) => n.delete(r.id)); return n; }); }
                  else { setExpanded((p) => { const n = new Set(p); slice.forEach((r) => n.add(r.id)); return n; }); }
                },
                collapseAllAriaLabel: 'Collapse all rows',
              } : undefined} />
              <Th screenReaderText="Select row" />
              <Th style={thNowrap}>Name</Th>
              <Th style={thNowrap}>Version</Th>
              <Th style={thNowrap}>Summary</Th>
              <Th screenReaderText="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            {slice.length === 0 ? (
              <Tr><Td colSpan={6} dataLabel="Empty">No packages match the current filter.</Td></Tr>
            ) : (
              slice.map((row, ri) => {
                const isEx = expanded.has(row.id);
                return (
                  <React.Fragment key={row.id}>
                    <Tr isExpanded={isEx ? true : undefined} isStriped={ri % 2 === 1}>
                      <Td expand={{ isExpanded: isEx, rowIndex: ri, onToggle: (_e, _r, o) => toggleExpand(row.id, o) }} />
                      <Td select={{ rowIndex: ri, onSelect: (_e, s) => toggleRow(row.id, s), isSelected: selected.has(row.id), variant: 'checkbox' }} />
                      <Td dataLabel="Name">
                        <Link to={`/python-packages/${encodeURIComponent(row.name)}`} style={{ textDecoration: 'none' }}>{row.name}</Link>
                      </Td>
                      <Td dataLabel="Version">{row.version}</Td>
                      <Td dataLabel="Summary">{row.summary}</Td>
                      <Td isActionCell>
                        <Dropdown isOpen={rowActionId === row.id} onOpenChange={(o) => setRowActionId(o ? row.id : null)}
                          toggle={(ref) => (<MenuToggle ref={ref} variant="plain" onClick={() => setRowActionId(rowActionId === row.id ? null : row.id)} isExpanded={rowActionId === row.id} aria-label={`Actions for ${row.name}`}><EllipsisVIcon /></MenuToggle>)}
                          popperProps={{ appendTo: () => document.body }}>
                          <DropdownList>
                            <DropdownItem key="view">View details</DropdownItem>
                            <DropdownItem key="install">Install</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </Td>
                    </Tr>
                    <Tr isExpanded={isEx} isHidden={!isEx} isStriped={ri % 2 === 1}>
                      <Td colSpan={6}><ExpandableRowContent><Text>{row.summary}</Text></ExpandableRowContent></Td>
                    </Tr>
                  </React.Fragment>
                );
              })
            )}
          </Tbody>
        </Table>

        <Pagination
          itemCount={itemCount} perPage={perPage} page={safePage}
          onSetPage={(_e, p) => setPage(p)}
          onPerPageSelect={(_e, pp, p) => { setPerPage(pp); setPage(p); }}
          variant={PaginationVariant.bottom} titles={paginationTitles}
          toggleTemplate={({ firstIndex, lastIndex, itemCount: t }) => <span>{firstIndex} - {lastIndex} of {t}</span>}
          isCompact isStatic ouiaId="python-packages-pagination-bottom"
          style={{ marginTop: 0, paddingTop: spacingMd, paddingBlockStart: spacingMd, paddingLeft: 0, paddingRight: 0, paddingInline: 0 }}
        />
      </section>
    </PageSection>
  );
};

export { PythonPackages };
