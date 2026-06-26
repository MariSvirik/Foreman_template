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
  Popover,
  SearchInput,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import {
  ColumnsIcon,
  EllipsisVIcon,
  ExportIcon,
  ExternalLinkAltIcon,
  OutlinedBookmarkIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { BulkSelect, BulkSelectValue } from '@patternfly/react-component-groups/dist/esm/BulkSelect';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { MOCK_SUBSCRIPTIONS } from './subscriptionData';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const thNowrap: React.CSSProperties = { whiteSpace: 'nowrap' };

type TableColumnId = 'name' | 'type' | 'sku' | 'contract' | 'startDate' | 'endDate' | 'requiresVirtWho' | 'entitlements' | 'hosts';

const TABLE_COLUMN_OPTIONS: { id: TableColumnId; label: string }[] = [
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'Type' },
  { id: 'sku', label: 'SKU' },
  { id: 'contract', label: 'Contract' },
  { id: 'startDate', label: 'Start date' },
  { id: 'endDate', label: 'End date' },
  { id: 'requiresVirtWho', label: 'Requires Virt-Who' },
  { id: 'entitlements', label: 'Entitlements' },
  { id: 'hosts', label: 'Hosts' },
];

const DEFAULT_COLUMN_VISIBILITY: Record<TableColumnId, boolean> = {
  name: true,
  type: true,
  sku: true,
  contract: true,
  startDate: true,
  endDate: true,
  requiresVirtWho: true,
  entitlements: true,
  hosts: true,
};

const Subscriptions: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
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

  const closeManageColumnsModal = () => setIsManageColumnsModalOpen(false);

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
        applySavedBookmarkQuery('Physical');
        break;
      case 'saved-b2':
        applySavedBookmarkQuery('CentOS');
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
    if (!q) return MOCK_SUBSCRIPTIONS;
    return MOCK_SUBSCRIPTIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        r.entitlements.toLowerCase().includes(q),
    );
  }, [search]);

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

  const onBulkSelect = (value: (typeof BulkSelectValue)[keyof typeof BulkSelectValue]) => {
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
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const itemCount = filtered.length;
  const cv = columnVisibility;

  return (
    <PageSection
      aria-label="Subscriptions"
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
              <Title headingLevel="h1" size="2xl" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Subscriptions
                <Popover
                  bodyContent={
                    <div>
                      This page shows the subscriptions available from this organization&#39;s subscription manifest.
                      <br />
                      Learn more about your overall subscription usage with the{' '}
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Subscriptions service
                      </a>
                      .
                    </div>
                  }
                  showClose
                >
                  <Button
                    variant="plain"
                    aria-label="More info about subscriptions"
                    style={{ padding: 0, fontSize: 'var(--pf-v5-global--FontSize--md, 14px)', verticalAlign: 'middle' }}
                    icon={<OutlinedQuestionCircleIcon />}
                  />
                </Popover>
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </section>

      <section
        aria-label="Subscriptions list"
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Toolbar
          id="subscriptions-toolbar"
          ouiaId="subscriptions-toolbar"
          inset={{ default: 'insetNone' }}
          style={{ marginBottom: 0 }}
        >
          <ToolbarContent alignItems="center">
            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem>
                <BulkSelect
                  ouiaId="subscriptions-bulk-select"
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
                    id: 'subscriptions-bulk-checkbox',
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
                      aria-label="Search subscriptions"
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

            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem>
                <Button variant="primary">Add subscriptions</Button>
              </ToolbarItem>
              <ToolbarItem style={{ marginLeft: spacingMd }}>
                <Button variant="secondary" icon={<ExportIcon />}>
                  Export CSV
                </Button>
              </ToolbarItem>
              <ToolbarItem style={{ marginLeft: spacingMd }}>
                <Tooltip content="Manage columns">
                  <Button
                    type="button"
                    variant="plain"
                    aria-label="Manage columns"
                    onClick={openManageColumnsModal}
                    icon={<ColumnsIcon />}
                  />
                </Tooltip>
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
                    <DropdownItem key="manage-manifest">Manage manifest</DropdownItem>
                    <DropdownItem key="view-usage">
                      View subscription usage{' '}
                      <ExternalLinkAltIcon style={{ marginLeft: '8px', fontSize: '0.85em' }} />
                    </DropdownItem>
                    <Divider component="li" key="divider" />
                    <DropdownItem key="delete" isDisabled={selected.size === 0}>
                      Delete
                    </DropdownItem>
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
                  ouiaId="subscriptions-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table
          aria-label="Subscriptions data"
          variant="compact"
          borders
          ouiaId="subscriptions-table"
          isStriped
          style={{ marginBottom: 0, width: '100%', tableLayout: 'fixed' }}
        >
          <colgroup>
            <col style={{ width: '45px' }} />
            {cv.name && <col style={{ width: '14%' }} />}
            {cv.type && <col style={{ width: '8%' }} />}
            {cv.sku && <col style={{ width: '12%' }} />}
            {cv.contract && <col style={{ width: '10%' }} />}
            {cv.startDate && <col style={{ width: '11%' }} />}
            {cv.endDate && <col style={{ width: '11%' }} />}
            {cv.requiresVirtWho && <col style={{ width: '13%' }} />}
            {cv.entitlements && <col style={{ width: '10%' }} />}
            {cv.hosts && <col style={{ width: '7%' }} />}
          </colgroup>
          <Thead>
            <Tr>
              <Th screenReaderText="Select row" />
              {cv.name && <Th style={thNowrap}>Name</Th>}
              {cv.type && <Th style={thNowrap}>Type</Th>}
              {cv.sku && <Th style={thNowrap}>SKU</Th>}
              {cv.contract && <Th style={thNowrap}>Contract</Th>}
              {cv.startDate && <Th style={thNowrap}>Start date</Th>}
              {cv.endDate && <Th style={thNowrap}>End date</Th>}
              {cv.requiresVirtWho && <Th style={thNowrap}>Requires Virt-Who</Th>}
              {cv.entitlements && <Th style={thNowrap}>Entitlements</Th>}
              {cv.hosts && <Th style={thNowrap}>Hosts</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {slice.map((row, rowIndex) => (
              <Tr key={row.id}>
                <Td
                  select={{
                    rowIndex,
                    onSelect: (_e, isSelected) => toggleRow(row.id, isSelected),
                    isSelected: selected.has(row.id),
                    variant: 'checkbox',
                  }}
                />
                {cv.name && (
                  <Td dataLabel="Name">
                    <Button variant="link" isInline>{row.name}</Button>
                  </Td>
                )}
                {cv.type && <Td dataLabel="Type">{row.type}</Td>}
                {cv.sku && <Td dataLabel="SKU">{row.sku}</Td>}
                {cv.contract && <Td dataLabel="Contract">{row.contract}</Td>}
                {cv.startDate && <Td dataLabel="Start date">{row.startDate}</Td>}
                {cv.endDate && <Td dataLabel="End date">{row.endDate}</Td>}
                {cv.requiresVirtWho && <Td dataLabel="Requires Virt-Who">{row.requiresVirtWho ? 'True' : 'False'}</Td>}
                {cv.entitlements && <Td dataLabel="Entitlements">{row.entitlements}</Td>}
                {cv.hosts && <Td dataLabel="Hosts">{row.hosts}</Td>}
              </Tr>
            ))}
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
          toggleTemplate={({ firstIndex, lastIndex, itemCount: total }) => (
            <span>
              {firstIndex} - {lastIndex} of {total}
            </span>
          )}
          ouiaId="subscriptions-pagination-bottom"
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
                    id={`sub-col-${col.id}`}
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

export { Subscriptions };
