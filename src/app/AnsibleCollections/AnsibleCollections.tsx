import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  InputGroup,
  InputGroupItem,
  MenuToggle,
  PageSection,
  Pagination,
  PaginationVariant,
  SearchInput,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { OutlinedBookmarkIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { MOCK_ANSIBLE_COLLECTIONS } from '@app/AnsibleCollections/ansibleCollectionData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { Link } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const thNowrap: React.CSSProperties = { whiteSpace: 'nowrap' };

const AnsibleCollections: React.FunctionComponent = () => {
  useDocumentTitle('PatternFly Seed | Ansible Collections');

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [...MOCK_ANSIBLE_COLLECTIONS];
    return MOCK_ANSIBLE_COLLECTIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.version.toLowerCase().includes(q) ||
        r.checksum.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const itemCount = filtered.length;

  const paginationTitles = {
    paginationAriaLabel: 'Ansible collections pagination',
    toFirstPageAriaLabel: 'Go to first page',
    toLastPageAriaLabel: 'Go to last page',
    toNextPageAriaLabel: 'Go to next page',
    toPreviousPageAriaLabel: 'Go to previous page',
    optionsToggleAriaLabel: 'Items per page',
    currPageAriaLabel: 'Current page',
  };

  return (
    <PageSection
      aria-label="Ansible Collections"
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
          <BreadcrumbItem isActive>Ansible Collections</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: spacingMd, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <TextContent>
          <Title headingLevel="h1" size="2xl">Ansible Collections</Title>
        </TextContent>
      </div>

      <section
        aria-label="Ansible collections table"
        style={{ paddingTop: 0, paddingRight: spacingL, paddingBottom: spacingL, paddingLeft: spacingL, boxSizing: 'border-box' }}
      >
        <Toolbar id="ansible-collections-toolbar" ouiaId="ansible-collections-toolbar" inset={{ default: 'insetNone' }} style={{ marginBottom: 0 }}>
          <ToolbarContent alignItems="center">
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
                      aria-label="Search ansible collections"
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

            <ToolbarGroup align={{ default: 'alignRight' }}>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={itemCount} perPage={perPage} page={safePage}
                  onSetPage={(_e, p) => setPage(p)}
                  onPerPageSelect={(_e, pp, p) => { setPerPage(pp); setPage(p); }}
                  variant={PaginationVariant.top} titles={paginationTitles}
                  toggleTemplate={({ firstIndex, lastIndex, itemCount: t }) => <span>{firstIndex} - {lastIndex} of {t}</span>}
                  isCompact ouiaId="ansible-collections-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Ansible collections" variant="compact" borders ouiaId="ansible-collections-table" style={{ marginBottom: 0, width: '100%' }}>
          <Thead>
            <Tr>
              <Th style={thNowrap}>Name</Th>
              <Th style={thNowrap}>Author</Th>
              <Th style={thNowrap}>Version</Th>
              <Th style={thNowrap}>Checksum</Th>
            </Tr>
          </Thead>
          <Tbody>
            {slice.length === 0 ? (
              <Tr>
                <Td colSpan={4} dataLabel="Empty">No collections match the current filter.</Td>
              </Tr>
            ) : (
              slice.map((row, rowIndex) => (
                <Tr key={row.id} isStriped={rowIndex % 2 === 1}>
                  <Td dataLabel="Name">
                    <Link to={`/ansible-collections/${encodeURIComponent(row.name)}`} style={{ textDecoration: 'none' }}>{row.name}</Link>
                  </Td>
                  <Td dataLabel="Author">{row.author}</Td>
                  <Td dataLabel="Version">{row.version}</Td>
                  <Td dataLabel="Checksum">{row.checksum}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>

        <Pagination
          itemCount={itemCount} perPage={perPage} page={safePage}
          onSetPage={(_e, p) => setPage(p)}
          onPerPageSelect={(_e, pp, p) => { setPerPage(pp); setPage(p); }}
          variant={PaginationVariant.bottom} titles={paginationTitles}
          toggleTemplate={({ firstIndex, lastIndex, itemCount: t }) => <span>{firstIndex} - {lastIndex} of {t}</span>}
          isCompact isStatic ouiaId="ansible-collections-pagination-bottom"
          style={{ marginTop: 0, paddingTop: spacingMd, paddingBlockStart: spacingMd, paddingLeft: 0, paddingRight: 0, paddingInline: 0 }}
        />
      </section>
    </PageSection>
  );
};

export { AnsibleCollections };
