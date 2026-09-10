import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  Divider,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Grid,
  GridItem,
  InputGroup,
  InputGroupItem,
  Label,
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
  CubesIcon,
  EllipsisVIcon,
  OutlinedBookmarkIcon,
} from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import tabStyles from '@patternfly/react-styles/css/components/Tabs/tabs.mjs';
import tabContentStyles from '@patternfly/react-styles/css/components/TabContent/tab-content.mjs';
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
  { id: '2', name: 'Without search', status: 'Stopped', lastModified: '2026-03-28 09:05 UTC', detail: 'Template detail variant without search toolbars.' },
  { id: '13', name: 'Example with more details', status: 'Running', lastModified: '2026-04-08 10:15 UTC', detail: 'Template detail variant with Errata-style description list items.' },
  { id: '14', name: 'Without tabs', status: 'Running', lastModified: '2026-04-09 09:00 UTC', detail: 'Detail page without tabs — content displayed directly below a horizontal description list.' },
  { id: '15', name: 'Index with tabs', status: 'Running', lastModified: '2026-04-10 11:00 UTC', detail: 'Index page with tabs (Container images) — title, tabs, search, and table; no breadcrumbs or description.', href: '/container-images' },
  { id: '16', name: 'Index with cards', status: 'Running', lastModified: '2026-04-11 09:30 UTC', detail: 'Index page with a card section between the title and the toolbar.', href: '/template/index-with-cards' },
  { id: '17', name: 'Index with cards and tabs', status: 'Running', lastModified: '2026-04-12 10:00 UTC', detail: 'Index page with summary cards and tabs above the toolbar and table.', href: '/template/index-with-cards-and-tabs' },
  { id: '1', name: 'alpha-service', status: 'Running', lastModified: '2026-04-01 14:22 UTC', detail: 'Deployment template for the alpha API service.' },
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

type TemplateIndexProps = {
  /** When true, render summary cards between the title and the toolbar. */
  showCards?: boolean;
  /** When true, render tabs between cards (or title) and the list. */
  showTabs?: boolean;
};

const TAB_IDS = { items: 'template-index-tab-items', empty: 'template-index-tab-empty' };
const PANEL_IDS = { items: 'template-index-panel-items', empty: 'template-index-panel-empty' };

const TemplateIndex: React.FunctionComponent<TemplateIndexProps> = ({
  showCards = false,
  showTabs = false,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
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
  const [activeTabKey, setActiveTabKey] = React.useState<'items' | 'empty'>('items');
  const [cardFilter, setCardFilter] = React.useState<string | null>(null);

  /** Card index variants omit bulk select and row checkboxes. */
  const hideSelection = showCards;

  const pageTitle = showCards && showTabs
    ? 'Index with cards and tabs'
    : showCards
      ? 'Index with cards'
      : 'Template';

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
  /** Expand + optional select + optional data columns + actions (always shown). */
  const tableBodyColSpan = 1 + (hideSelection ? 0 : 1) + visibleDataColumnCount + 1;

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
    let rows = MOCK_ROWS;
    if (cardFilter) {
      rows = rows.filter((r) => r.status === cardFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) {
      return rows;
    }
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.lastModified.toLowerCase().includes(q),
    );
  }, [search, cardFilter]);

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

  const cardStats = React.useMemo(() => {
    const countByStatus = (status: string) => MOCK_ROWS.filter((r) => r.status === status).length;
    return [
      {
        id: 'running',
        title: 'Items with running status',
        value: String(countByStatus('Running')),
        status: 'Running',
        showLabel: false,
      },
      {
        id: 'stopped',
        title: 'Items with stopped status',
        value: String(countByStatus('Stopped')),
        status: 'Stopped',
        showLabel: false,
      },
      {
        id: 'failed',
        title: 'Items with failed status',
        value: String(countByStatus('Failed')),
        status: 'Failed',
        showLabel: true,
      },
    ];
  }, []);

  const applyCardFilter = (status: string) => {
    setCardFilter((prev) => (prev === status ? null : status));
    setPage(1);
  };

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
                {pageTitle}
              </Title>
            </TextContent>
          </LevelItem>
          <LevelItem>
            <Button variant="secondary">Edit</Button>
          </LevelItem>
        </Level>
      </section>

      {showCards ? (
        <section
          aria-label="Summary cards"
          style={{
            paddingTop: spacingMd,
            paddingRight: spacingL,
            paddingBottom: spacingMd,
            paddingLeft: spacingL,
            boxSizing: 'border-box',
          }}
        >
          <Grid hasGutter>
            {cardStats.map((card) => (
              <GridItem key={card.id} span={12} md={4}>
                <Card
                  isCompact
                  isFlat
                  isFullHeight
                  isSelectable
                  isSelected={cardFilter === card.status}
                >
                  <CardTitle>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        applyCardFilter(card.status);
                      }}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {card.title}
                    </a>
                  </CardTitle>
                  <CardBody>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {card.showLabel ? (
                        <Label color="red" isCompact>
                          Critical
                        </Label>
                      ) : null}
                      <Button
                        variant="link"
                        isInline
                        component="a"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          applyCardFilter(card.status);
                        }}
                        style={{
                          fontSize: '18px',
                          fontFamily:
                            'var(--pf-v5-global--FontFamily--text, "RedHatText", "Red Hat Text", Helvetica, Arial, sans-serif)',
                          fontWeight: 700,
                          lineHeight: 1.2,
                        }}
                      >
                        {card.value}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </section>
      ) : null}

      {showTabs ? (
        <div
          style={{
            paddingTop: 0,
            paddingRight: spacingL,
            paddingLeft: spacingL,
            boxSizing: 'border-box',
          }}
        >
          <div className={css(tabStyles.tabs)} aria-label="Template index tabs">
            <ul className={css(tabStyles.tabsList)} role="tablist">
              <li
                className={css(tabStyles.tabsItem, activeTabKey === 'items' && tabStyles.modifiers.current)}
                role="presentation"
              >
                <button
                  type="button"
                  id={TAB_IDS.items}
                  className={css(tabStyles.tabsLink)}
                  role="tab"
                  aria-selected={activeTabKey === 'items'}
                  aria-controls={PANEL_IDS.items}
                  tabIndex={activeTabKey === 'items' ? 0 : -1}
                  onClick={() => setActiveTabKey('items')}
                >
                  <span className={css(tabStyles.tabsItemText)}>Items</span>
                </button>
              </li>
              <li
                className={css(tabStyles.tabsItem, activeTabKey === 'empty' && tabStyles.modifiers.current)}
                role="presentation"
              >
                <button
                  type="button"
                  id={TAB_IDS.empty}
                  className={css(tabStyles.tabsLink)}
                  role="tab"
                  aria-selected={activeTabKey === 'empty'}
                  aria-controls={PANEL_IDS.empty}
                  tabIndex={activeTabKey === 'empty' ? 0 : -1}
                  onClick={() => setActiveTabKey('empty')}
                >
                  <span className={css(tabStyles.tabsItemText)}>Empty example</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      {showTabs ? (
        <div style={{ paddingBottom: spacingL, boxSizing: 'border-box' }}>
          <section
            id={PANEL_IDS.items}
            role="tabpanel"
            aria-labelledby={TAB_IDS.items}
            className={css(tabContentStyles.tabContent)}
            style={{ padding: 0 }}
            hidden={activeTabKey !== 'items'}
            tabIndex={0}
          >
            <div
              style={{
                paddingTop: 0,
                paddingRight: spacingL,
                paddingBottom: 0,
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
            {!hideSelection ? (
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
            ) : null}

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
              {!hideSelection ? <Th screenReaderText="Select row" /> : null}
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
                    {!hideSelection ? (
                      <Td
                        select={{
                          rowIndex,
                          onSelect: (_e, isSelected) => toggleRow(row.id, isSelected),
                          isSelected: selected.has(row.id),
                          variant: 'checkbox',
                        }}
                      />
                    ) : null}
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
            </div>
          </section>

          <section
            id={PANEL_IDS.empty}
            role="tabpanel"
            aria-labelledby={TAB_IDS.empty}
            className={css(tabContentStyles.tabContent)}
            style={{
              paddingTop: spacingL,
              paddingRight: spacingL,
              paddingBottom: 0,
              paddingLeft: spacingL,
            }}
            hidden={activeTabKey !== 'empty'}
            tabIndex={0}
          >
            <EmptyState variant={EmptyStateVariant.lg}>
              <EmptyStateHeader
                titleText="No items to display yet"
                headingLevel="h4"
                icon={<EmptyStateIcon icon={CubesIcon} />}
              />
              <EmptyStateBody>
                This section is currently empty. Items will appear here once they are available.
              </EmptyStateBody>
            </EmptyState>
          </section>
        </div>
      ) : (
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
            {!hideSelection ? (
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
            ) : null}

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
              {!hideSelection ? <Th screenReaderText="Select row" /> : null}
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
                    {!hideSelection ? (
                      <Td
                        select={{
                          rowIndex,
                          onSelect: (_e, isSelected) => toggleRow(row.id, isSelected),
                          isSelected: selected.has(row.id),
                          variant: 'checkbox',
                        }}
                      />
                    ) : null}
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
      )}

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
