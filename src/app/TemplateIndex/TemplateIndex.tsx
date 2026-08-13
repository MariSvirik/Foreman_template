import * as React from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  InputGroup,
  InputGroupItem,
  Level,
  LevelItem,
  MenuToggle,
  Modal,
  ModalVariant,
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
import {
  ColumnsIcon,
  EllipsisVIcon,
  OutlinedBookmarkIcon,
} from '@patternfly/react-icons';
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const thNowrap: React.CSSProperties = { whiteSpace: 'nowrap' };

type TableColumnId = 'name' | 'status' | 'lastModified';

const TABLE_COLUMN_OPTIONS: { id: TableColumnId; label: string }[] = [
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status' },
  { id: 'lastModified', label: 'Last modified' },
];

const DEFAULT_COLUMN_VISIBILITY: Record<TableColumnId, boolean> = {
  name: true,
  status: true,
  lastModified: true,
};

type TemplateRow = {
  id: string;
  name: string;
  status: string;
  lastModified: string;
  detail: string;
  /** Optional absolute path for index-page examples (bypasses /template/:id). */
  href?: string;
};

const MOCK_ROWS: TemplateRow[] = [
  { id: '1', name: 'alpha-service', status: 'Running', lastModified: '2026-04-01 14:22 UTC', detail: 'Deployment template for the alpha API service.' },
  { id: '2', name: 'Without search', status: 'Stopped', lastModified: '2026-03-28 09:05 UTC', detail: 'Template detail variant without search toolbars.' },
  { id: '13', name: 'Example with more details', status: 'Running', lastModified: '2026-04-08 10:15 UTC', detail: 'Template detail variant with Errata-style description list items.' },
  { id: '14', name: 'Without tabs', status: 'Running', lastModified: '2026-04-09 09:00 UTC', detail: 'Detail page without tabs — content displayed directly below a horizontal description list.' },
  { id: '15', name: 'Index with tabs', status: 'Running', lastModified: '2026-04-10 11:00 UTC', detail: 'Index page with tabs (Container images) — title, tabs, search, and table; no breadcrumbs or description.', href: '/container-images' },
  { id: '3', name: 'gamma-api', status: 'Running', lastModified: '2026-04-06 11:40 UTC', detail: 'REST API gateway configuration.' },
  { id: '4', name: 'delta-cache', status: 'Pending', lastModified: '2026-04-05 16:18 UTC', detail: 'Redis-backed cache layer.' },
  { id: '5', name: 'epsilon-jobs', status: 'Failed', lastModified: '2026-03-30 22:11 UTC', detail: 'Scheduled job runner template.' },
  { id: '6', name: 'zeta-stream', status: 'Running', lastModified: '2026-04-02 08:00 UTC', detail: 'Event stream consumer.' },
  { id: '7', name: 'eta-gateway', status: 'Stopped', lastModified: '2026-03-25 13:50 UTC', detail: 'Edge routing and TLS termination.' },
  { id: '8', name: 'theta-index', status: 'Running', lastModified: '2026-04-04 10:33 UTC', detail: 'Search index maintenance.' },
  { id: '9', name: 'iota-sync', status: 'Pending', lastModified: '2026-04-03 12:00 UTC', detail: 'Cross-cluster sync job.' },
  { id: '10', name: 'kappa-batch', status: 'Running', lastModified: '2026-03-29 18:45 UTC', detail: 'Nightly batch processing.' },
  { id: '11', name: 'lambda-edge', status: 'Failed', lastModified: '2026-03-27 09:12 UTC', detail: 'CDN edge function template.' },
  { id: '12', name: 'mu-storage', status: 'Running', lastModified: '2026-04-07 07:30 UTC', detail: 'Object storage bucket policy.' },
];

const TemplateIndex: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(5);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [openActionId, setOpenActionId] = React.useState<string | null>(null);
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);
  const [toolbarKebabOpen, setToolbarKebabOpen] = React.useState(false);
  const [isManageColumnsModalOpen, setIsManageColumnsModalOpen] = React.useState(false);
  const [columnVisibility, setColumnVisibility] =
    React.useState<Record<TableColumnId, boolean>>(DEFAULT_COLUMN_VISIBILITY);
  const [draftColumnVisibility, setDraftColumnVisibility] =
    React.useState<Record<TableColumnId, boolean>>(DEFAULT_COLUMN_VISIBILITY);

  const openManageColumnsModal = () => {
    setDraftColumnVisibility({ ...columnVisibility });
    setIsManageColumnsModalOpen(true);
  };

  const closeManageColumnsModal = () => {
    setIsManageColumnsModalOpen(false);
  };

  const saveManageColumnsModal = () => {
    setColumnVisibility({ ...draftColumnVisibility });
    closeManageColumnsModal();
  };

  const setDraftColumn = (id: TableColumnId, checked: boolean) => {
    setDraftColumnVisibility((prev) => {
      const next = { ...prev, [id]: checked };
      const anyVisible = TABLE_COLUMN_OPTIONS.some((c) => next[c.id]);
      return anyVisible ? next : prev;
    });
  };

  const visibleDataColumnCount = TABLE_COLUMN_OPTIONS.filter((c) => columnVisibility[c.id]).length;
  /** Expand + select + optional data columns + actions (always shown). */
  const tableBodyColSpan = 2 + visibleDataColumnCount + 1;

  const applySavedBookmarkQuery = (query: string) => {
    setSearch(query);
    setPage(1);
    setBookmarkOpen(false);
  };

  const handleBookmarkMenuSelect = (_e?: React.MouseEvent<Element, MouseEvent>, value?: string | number) => {
    const action = String(value ?? '');
    switch (action) {
      case 'bookmark-this-search':
        setBookmarkOpen(false);
        break;
      case 'saved-b1':
        applySavedBookmarkQuery('running');
        break;
      case 'saved-b2':
        applySavedBookmarkQuery('stopped');
        break;
      case 'manage-bookmarks':
        setBookmarkOpen(false);
        break;
      case 'documentation':
        setBookmarkOpen(false);
        window.open('https://www.patternfly.org', '_blank', 'noopener,noreferrer');
        break;
      default:
        setBookmarkOpen(false);
    }
  };

  const submitSearch = () => {
    setPage(1);
  };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return MOCK_ROWS;
    }
    return MOCK_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.lastModified.toLowerCase().includes(q),
    );
  }, [search]);

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
    paginationAriaLabel: 'Template list pagination',
    toFirstPageAriaLabel: 'Go to first page',
    toLastPageAriaLabel: 'Go to last page',
    toNextPageAriaLabel: 'Go to next page',
    toPreviousPageAriaLabel: 'Go to previous page',
    optionsToggleAriaLabel: 'Items per page',
    currPageAriaLabel: 'Current page',
  };

  return (
    <PageSection
      aria-label="Template index"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      <section
        aria-label="Title and actions"
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
                Template
              </Title>
            </TextContent>
          </LevelItem>
          <LevelItem>
            <Button variant="secondary">Edit</Button>
          </LevelItem>
        </Level>
      </section>

      <section
        aria-label="Template list"
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Toolbar
          id="template-index-toolbar"
          ouiaId="template-index-toolbar"
          inset={{ default: 'insetNone' }}
          style={{ marginBottom: 0 }}
        >
          <ToolbarContent alignItems="center">
            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem>
                <BulkSelect
                  ouiaId="template-bulk-select"
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
                    id: 'template-bulk-checkbox',
                    'aria-label':
                      selected.size > 0
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
                      value={search}
                      onChange={(_e, v) => setSearch(v)}
                      onClear={() => {
                        setSearch('');
                        setPage(1);
                      }}
                      onSearch={() => submitSearch()}
                      aria-label="Search templates"
                    />
                  </InputGroupItem>
                  <InputGroupItem>
                    <Dropdown
                      isOpen={bookmarkOpen}
                      onOpenChange={setBookmarkOpen}
                      onSelect={handleBookmarkMenuSelect}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          variant="default"
                          isFullHeight
                          className="app-template-search-bookmark-toggle"
                          onClick={() => setBookmarkOpen(!bookmarkOpen)}
                          isExpanded={bookmarkOpen}
                          aria-label="Search bookmarks"
                          icon={<OutlinedBookmarkIcon />}
                        />
                      )}
                      popperProps={{ appendTo: () => document.body }}
                    >
                      <DropdownList>
                        <DropdownItem
                          value="bookmark-this-search"
                          icon={<OutlinedBookmarkIcon />}
                        >
                          Bookmark this search
                        </DropdownItem>
                        <Divider component="li" />
                        <DropdownGroup label="Saved bookmarks" labelHeadingLevel="h2">
                          <DropdownList>
                            <DropdownItem value="saved-b1">Bookmark 1</DropdownItem>
                            <DropdownItem value="saved-b2">Bookmark 2</DropdownItem>
                          </DropdownList>
                        </DropdownGroup>
                        <Divider component="li" />
                        <DropdownItem value="manage-bookmarks">Manage bookmarks</DropdownItem>
                        <DropdownItem value="documentation">Documentation</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </InputGroupItem>
                </InputGroup>
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem>
                <Button variant="primary">Create item</Button>
              </ToolbarItem>
              <ToolbarItem style={{ marginLeft: spacingMd }}>
                <Button
                  type="button"
                  variant="plain"
                  aria-label="Manage columns"
                  onClick={openManageColumnsModal}
                  icon={<ColumnsIcon />}
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
                    <DropdownItem key="t1">Toolbar action A</DropdownItem>
                    <DropdownItem key="t2">Toolbar action B</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup align={{ default: 'alignRight' }}>
              <ToolbarItem>
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
                  isCompact
                  ouiaId="template-index-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table
          aria-label="Template data"
          variant="compact"
          borders
          ouiaId="template-index-table"
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
              {columnVisibility.name ? <Th style={thNowrap}>Name</Th> : null}
              {columnVisibility.status ? <Th style={thNowrap}>Status</Th> : null}
              {columnVisibility.lastModified ? (
                <Th style={{ ...thNowrap, minWidth: '11rem' }}>Last modified</Th>
              ) : null}
              <Th screenReaderText="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            {slice.map((row, rowIndex) => {
              const isEx = expanded.has(row.id);
              return (
                <React.Fragment key={row.id}>
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
                    {columnVisibility.name ? (
                      <Td dataLabel="Name">
                        <Button
                          variant="link"
                          isInline
                          onClick={() =>
                            navigate(row.href ?? `/template/${encodeURIComponent(row.name)}`)
                          }
                        >
                          {row.name}
                        </Button>
                      </Td>
                    ) : null}
                    {columnVisibility.status ? <Td dataLabel="Status">{row.status}</Td> : null}
                    {columnVisibility.lastModified ? (
                      <Td dataLabel="Last modified">{row.lastModified}</Td>
                    ) : null}
                    <Td isActionCell>
                      <Dropdown
                        isOpen={openActionId === row.id}
                        onOpenChange={(open) => setOpenActionId(open ? row.id : null)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            variant="plain"
                            onClick={() => setOpenActionId(openActionId === row.id ? null : row.id)}
                            isExpanded={openActionId === row.id}
                            aria-label={`Actions for ${row.name}`}
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                        popperProps={{ appendTo: () => document.body }}
                      >
                        <DropdownList>
                          <DropdownItem key="a1">Action 1</DropdownItem>
                          <DropdownItem key="a2">Action 2</DropdownItem>
                          <DropdownItem key="a3">Action 3</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </Td>
                  </Tr>
                  <Tr isExpanded={isEx} isHidden={!isEx} isStriped={rowIndex % 2 === 1}>
                    <Td colSpan={tableBodyColSpan}>
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
          isStatic
          isCompact
          titles={paginationTitles}
          toggleTemplate={({ firstIndex, lastIndex, itemCount: total }) => (
            <span>
              {firstIndex} - {lastIndex} of {total}
            </span>
          )}
          ouiaId="template-index-pagination-bottom"
          style={{
            marginTop: spacingMd,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingInline: 0,
          }}
        />
      </section>

      <Modal
        variant={ModalVariant.medium}
        title="Manage columns"
        description="Selected categories will be displayed in the table."
        isOpen={isManageColumnsModalOpen}
        onClose={closeManageColumnsModal}
        actions={[
          <Button key="save" variant="primary" onClick={saveManageColumnsModal}>
            Save
          </Button>,
          <Button key="cancel" variant="link" onClick={closeManageColumnsModal}>
            Cancel
          </Button>,
        ]}
      >
        <Table aria-label="Choose visible columns" variant="compact" borders style={{ marginBottom: 0 }}>
          <Tbody>
            {TABLE_COLUMN_OPTIONS.map((col) => (
              <Tr key={col.id}>
                <Td dataLabel={col.label} style={{ paddingBlock: 'var(--pf-v5-global--spacer--xs, 0.25rem)' }}>
                  <Checkbox
                    id={`template-col-${col.id}`}
                    label={col.label}
                    isChecked={draftColumnVisibility[col.id]}
                    onChange={(_e, checked) => setDraftColumn(col.id, Boolean(checked))}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Modal>
    </PageSection>
  );
};

export { TemplateIndex };
