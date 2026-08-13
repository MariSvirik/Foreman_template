import * as React from 'react';
import {
  Button,
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
  PageSection,
  Pagination,
  PaginationVariant,
  Popover,
  SearchInput,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  CubeIcon,
  OutlinedBookmarkIcon,
  OutlinedQuestionCircleIcon,
  SyncAltIcon,
} from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import tabStyles from '@patternfly/react-styles/css/components/Tabs/tabs.mjs';
import tabContentStyles from '@patternfly/react-styles/css/components/TabContent/tab-content.mjs';
import {
  SortByDirection,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import type { ISortBy } from '@patternfly/react-table';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const thNowrap: React.CSSProperties = { whiteSpace: 'nowrap' };

type TabKey = 'synced' | 'booted';

const TAB_IDS: Record<TabKey, string> = {
  synced: 'container-images-tab-synced',
  booted: 'container-images-tab-booted',
};

const PANEL_IDS: Record<TabKey, string> = {
  synced: 'container-images-panel-synced',
  booted: 'container-images-panel-booted',
};

type ContainerImageRow = {
  id: string;
  tag: string;
  manifestDigest: string;
  type: string;
  product: string;
  labelsAnnotations: string;
};

const MOCK_SYNCED: ContainerImageRow[] = [
  {
    id: 's1',
    tag: 'latest',
    manifestDigest: 'sha256:a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890ab',
    type: 'Image',
    product: 'Red Hat Enterprise Linux 9',
    labelsAnnotations: '2 | 1',
  },
  {
    id: 's2',
    tag: '9.4',
    manifestDigest: 'sha256:b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcd',
    type: 'Image',
    product: 'Red Hat Enterprise Linux 9',
    labelsAnnotations: '5 | 0',
  },
  {
    id: 's3',
    tag: 'ubi9',
    manifestDigest: 'sha256:c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'Image',
    product: 'Red Hat Universal Base Image 9',
    labelsAnnotations: '3 | 2',
  },
  {
    id: 's4',
    tag: '8.10',
    manifestDigest: 'sha256:d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef12',
    type: 'Image',
    product: 'Red Hat Enterprise Linux 8',
    labelsAnnotations: '4 | 1',
  },
  {
    id: 's5',
    tag: 'minimal',
    manifestDigest: 'sha256:e5f678901234567890abcdef1234567890abcdef1234567890abcdef1234',
    type: 'Image',
    product: 'Red Hat Universal Base Image 9',
    labelsAnnotations: '1 | 0',
  },
  {
    id: 's6',
    tag: 'bootc',
    manifestDigest: 'sha256:f678901234567890abcdef1234567890abcdef1234567890abcdef123456',
    type: 'Bootable',
    product: 'Red Hat Enterprise Linux 9',
    labelsAnnotations: '6 | 3',
  },
];

const MOCK_BOOTED: ContainerImageRow[] = [
  {
    id: 'b1',
    tag: 'rhel-9.4-bootc',
    manifestDigest: 'sha256:11223344556677889900aabbccddeeff11223344556677889900aabbccdd',
    type: 'Bootable',
    product: 'Red Hat Enterprise Linux 9',
    labelsAnnotations: '8 | 2',
  },
  {
    id: 'b2',
    tag: 'edge-9.4',
    manifestDigest: 'sha256:223344556677889900aabbccddeeff11223344556677889900aabbccddee',
    type: 'Bootable',
    product: 'Red Hat Enterprise Linux 9',
    labelsAnnotations: '4 | 1',
  },
  {
    id: 'b3',
    tag: 'ostree-commit',
    manifestDigest: 'sha256:3344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    type: 'Bootable',
    product: 'Red Hat Enterprise Linux 8',
    labelsAnnotations: '2 | 0',
  },
];

const COL = {
  tag: 0,
  manifestDigest: 1,
  type: 2,
  product: 3,
  labelsAnnotations: 4,
} as const;

const ContainerImages: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<TabKey>('synced');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [search, setSearch] = React.useState('');
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<ISortBy>({
    index: COL.tag,
    direction: SortByDirection.asc,
  });

  React.useEffect(() => {
    setPage(1);
    setSearch('');
  }, [activeTabKey]);

  const sourceRows = activeTabKey === 'synced' ? MOCK_SYNCED : MOCK_BOOTED;

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = !q
      ? [...sourceRows]
      : sourceRows.filter(
          (r) =>
            r.tag.toLowerCase().includes(q) ||
            r.manifestDigest.toLowerCase().includes(q) ||
            r.type.toLowerCase().includes(q) ||
            r.product.toLowerCase().includes(q) ||
            r.labelsAnnotations.toLowerCase().includes(q),
        );

    const dir = sortBy.direction === SortByDirection.asc ? 1 : -1;
    const idx = sortBy.index ?? COL.tag;
    rows.sort((a, b) => {
      const get = (row: ContainerImageRow) => {
        switch (idx) {
          case COL.manifestDigest:
            return row.manifestDigest;
          case COL.type:
            return row.type;
          case COL.product:
            return row.product;
          case COL.labelsAnnotations:
            return row.labelsAnnotations;
          case COL.tag:
          default:
            return row.tag;
        }
      };
      return get(a).localeCompare(get(b)) * dir;
    });

    return rows;
  }, [sourceRows, search, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const itemCount = filtered.length;

  const onSort = (
    _e: React.MouseEvent,
    columnIndex: number,
    direction: SortByDirection,
  ) => {
    setSortBy({ index: columnIndex, direction });
    setPage(1);
  };

  const applySavedBookmarkQuery = (query: string) => {
    setSearch(query);
    setPage(1);
    setBookmarkOpen(false);
  };

  const handleBookmarkMenuSelect = (
    _e?: React.MouseEvent<Element, MouseEvent>,
    value?: string | number,
  ) => {
    const action = String(value ?? '');
    switch (action) {
      case 'bookmark-this-search':
        setBookmarkOpen(false);
        break;
      case 'saved-b1':
        applySavedBookmarkQuery('latest');
        break;
      case 'saved-b2':
        applySavedBookmarkQuery('bootc');
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

  const paginationTitles = {
    paginationAriaLabel: 'Container images pagination',
    toFirstPageAriaLabel: 'Go to first page',
    toLastPageAriaLabel: 'Go to last page',
    toNextPageAriaLabel: 'Go to next page',
    toPreviousPageAriaLabel: 'Go to previous page',
    optionsToggleAriaLabel: 'Items per page',
    currPageAriaLabel: 'Current page',
  };

  const renderTab = (key: TabKey, label: string, icon: React.ReactNode) => (
    <li
      className={css(tabStyles.tabsItem, activeTabKey === key && tabStyles.modifiers.current)}
      role="presentation"
    >
      <button
        type="button"
        id={TAB_IDS[key]}
        className={css(tabStyles.tabsLink)}
        role="tab"
        aria-selected={activeTabKey === key}
        aria-controls={PANEL_IDS[key]}
        tabIndex={activeTabKey === key ? 0 : -1}
        onClick={() => setActiveTabKey(key)}
      >
        <span className={css(tabStyles.tabsItemIcon)}>{icon}</span>
        <span className={css(tabStyles.tabsItemText)}>{label}</span>
      </button>
    </li>
  );

  const tableSection = (
    <section
      aria-label="Container images list"
      style={{
        paddingTop: 0,
        paddingRight: spacingL,
        paddingBottom: 0,
        paddingLeft: spacingL,
        boxSizing: 'border-box',
      }}
    >
      <Toolbar
        id="container-images-toolbar"
        ouiaId="container-images-toolbar"
        inset={{ default: 'insetNone' }}
        style={{ marginBottom: 0 }}
      >
        <ToolbarContent alignItems="center">
          <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
            <ToolbarItem style={{ flex: '1 1 auto', width: '100%', maxWidth: '100%' }}>
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
                    onSearch={() => setPage(1)}
                    aria-label="Search container images"
                  />
                </InputGroupItem>
                <InputGroupItem className="app-template-search-bookmark-slot">
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
                      <DropdownItem value="bookmark-this-search" icon={<OutlinedBookmarkIcon />}>
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

          <ToolbarGroup align={{ default: 'alignRight' }}>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={itemCount}
                perPage={perPage}
                page={safePage}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp, p) => {
                  setPerPage(pp);
                  setPage(p);
                }}
                variant={PaginationVariant.top}
                titles={paginationTitles}
                isCompact
                ouiaId="container-images-pagination-top"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Table
        aria-label={`${activeTabKey === 'synced' ? 'Synced' : 'Booted'} container images`}
        variant="compact"
        borders
        isStriped
        ouiaId="container-images-table"
        style={{ marginBottom: 0, width: '100%', tableLayout: 'fixed' }}
      >
        <colgroup>
          <col style={{ width: '14%' }} />
          <col style={{ width: '36%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '24%' }} />
          <col style={{ width: '14%' }} />
        </colgroup>
        <Thead>
          <Tr>
            <Th
              sort={{ columnIndex: COL.tag, sortBy, onSort }}
              style={thNowrap}
            >
              Tag
            </Th>
            <Th
              sort={{ columnIndex: COL.manifestDigest, sortBy, onSort }}
              style={thNowrap}
            >
              Manifest digest
            </Th>
            <Th
              sort={{ columnIndex: COL.type, sortBy, onSort }}
              style={thNowrap}
            >
              Type
            </Th>
            <Th
              sort={{ columnIndex: COL.product, sortBy, onSort }}
              style={thNowrap}
            >
              Product
            </Th>
            <Th
              sort={{ columnIndex: COL.labelsAnnotations, sortBy, onSort }}
              style={thNowrap}
            >
              Labels | Annotations
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {slice.length === 0 ? (
            <Tr>
              <Td colSpan={5} dataLabel="Empty">
                No container images match the current filter.
              </Td>
            </Tr>
          ) : (
            slice.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel="Tag">{row.tag}</Td>
                <Td dataLabel="Manifest digest">
                  <span
                    style={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={row.manifestDigest}
                  >
                    {row.manifestDigest}
                  </span>
                </Td>
                <Td dataLabel="Type">{row.type}</Td>
                <Td dataLabel="Product">{row.product}</Td>
                <Td dataLabel="Labels | Annotations">{row.labelsAnnotations}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      <Pagination
        itemCount={itemCount}
        perPage={perPage}
        page={safePage}
        onSetPage={(_e, p) => setPage(p)}
        onPerPageSelect={(_e, pp, p) => {
          setPerPage(pp);
          setPage(p);
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
        ouiaId="container-images-pagination-bottom"
        style={{
          marginTop: spacingMd,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingInline: 0,
        }}
      />
    </section>
  );

  return (
    <PageSection
      aria-label="Container images"
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
              <Title
                headingLevel="h1"
                size="2xl"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Container Images
                <Popover
                  bodyContent="Browse container image tags that have been synced to this organization, or bootable images used by hosts."
                  showClose
                >
                  <Button
                    variant="plain"
                    aria-label="More info about container images"
                    style={{
                      padding: 0,
                      fontSize: 'var(--pf-v5-global--FontSize--md, 14px)',
                      verticalAlign: 'middle',
                    }}
                    icon={<OutlinedQuestionCircleIcon />}
                  />
                </Popover>
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </section>

      <div
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <div className={css(tabStyles.tabs)} aria-label="Container images tabs">
          <ul className={css(tabStyles.tabsList)} role="tablist">
            {renderTab('synced', 'Synced', <SyncAltIcon />)}
            {renderTab('booted', 'Booted', <CubeIcon />)}
          </ul>
        </div>
      </div>

      <div style={{ paddingBottom: spacingL, boxSizing: 'border-box' }}>
        <section
          id={PANEL_IDS.synced}
          role="tabpanel"
          aria-labelledby={TAB_IDS.synced}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'synced'}
          tabIndex={0}
        >
          {activeTabKey === 'synced' ? tableSection : null}
        </section>
        <section
          id={PANEL_IDS.booted}
          role="tabpanel"
          aria-labelledby={TAB_IDS.booted}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'booted'}
          tabIndex={0}
        >
          {activeTabKey === 'booted' ? tableSection : null}
        </section>
      </div>
    </PageSection>
  );
};

export { ContainerImages };
