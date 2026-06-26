import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Checkbox,
  Menu,
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuList,
  MenuSearch,
  MenuSearchInput,
  MenuToggle,
  PageSection,
  Pagination,
  PaginationVariant,
  SearchInput,
  TextContent,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { MOCK_DEB_PACKAGES } from '@app/DebPackages/debPackageData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { Link } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const thNowrap: React.CSSProperties = { whiteSpace: 'nowrap' };

const REPOSITORY_OPTIONS = ['All Repositories', 'Debian focal', 'Debian jammy', 'Ubuntu 22.04'] as const;

const DebPackages: React.FunctionComponent = () => {
  useDocumentTitle('PatternFly Seed | Deb Packages');

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterApplicable, setFilterApplicable] = React.useState(false);
  const [filterUpgradable, setFilterUpgradable] = React.useState(false);

  const [repository, setRepository] = React.useState<string>(REPOSITORY_OPTIONS[0]);
  const [repoOpen, setRepoOpen] = React.useState(false);
  const [repoFilter, setRepoFilter] = React.useState('');
  const repoMenuRef = React.useRef<HTMLDivElement>(null);
  const repoToggleRef = React.useRef<HTMLButtonElement>(null);

  const filteredRepoOptions = React.useMemo(() => {
    const q = repoFilter.trim().toLowerCase();
    if (!q) return [...REPOSITORY_OPTIONS];
    return REPOSITORY_OPTIONS.filter((opt) => opt.toLowerCase().includes(q));
  }, [repoFilter]);

  const filtered = React.useMemo(() => {
    let rows = [...MOCK_DEB_PACKAGES];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.version.toLowerCase().includes(q) ||
          r.architecture.toLowerCase().includes(q),
      );
    }
    if (filterApplicable) {
      rows = rows.filter((r) => r.applicable > 0);
    }
    if (filterUpgradable) {
      rows = rows.filter((r) => r.upgradable > 0);
    }
    return rows;
  }, [searchQuery, filterApplicable, filterUpgradable]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const itemCount = filtered.length;

  const hostsLabel = (r: (typeof MOCK_DEB_PACKAGES)[number]) =>
    `${r.applicable} Applicable, ${r.upgradable} Upgradable`;

  const paginationTitles = {
    paginationAriaLabel: 'Deb packages pagination',
    toFirstPageAriaLabel: 'Go to first page',
    toLastPageAriaLabel: 'Go to last page',
    toNextPageAriaLabel: 'Go to next page',
    toPreviousPageAriaLabel: 'Go to previous page',
    optionsToggleAriaLabel: 'Items per page',
    currPageAriaLabel: 'Current page',
  };

  return (
    <PageSection
      aria-label="Deb Packages"
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
          <BreadcrumbItem isActive>Deb Packages</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: spacingMd, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <TextContent>
          <Title headingLevel="h1" size="2xl">Deb Packages</Title>
        </TextContent>
      </div>

      <section
        aria-label="Deb packages table"
        style={{ paddingTop: 0, paddingRight: spacingL, paddingBottom: spacingL, paddingLeft: spacingL, boxSizing: 'border-box' }}
      >
        <Toolbar id="deb-packages-toolbar" ouiaId="deb-packages-toolbar" inset={{ default: 'insetNone' }} style={{ marginBottom: 0 }}>
          <ToolbarContent alignItems="center">
            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <ToolbarItem>
                <MenuContainer
                  menu={
                    <Menu
                      ref={repoMenuRef}
                      isPlain
                      role="listbox"
                      onSelect={(_e, itemId) => {
                        if (itemId === 'no-results' || typeof itemId !== 'string') return;
                        setRepository(itemId);
                        setRepoOpen(false);
                        setRepoFilter('');
                      }}
                      selected={repository}
                    >
                      <MenuSearch>
                        <MenuSearchInput>
                          <TextInput
                            value={repoFilter}
                            type="search"
                            onChange={(_e, v) => setRepoFilter(v)}
                            aria-label="Filter repositories"
                            placeholder="Search repositories"
                          />
                        </MenuSearchInput>
                      </MenuSearch>
                      <MenuContent maxMenuHeight="240px">
                        <MenuList aria-label="Repositories">
                          {filteredRepoOptions.length === 0 ? (
                            <MenuItem itemId="no-results" isAriaDisabled>No results</MenuItem>
                          ) : (
                            filteredRepoOptions.map((opt) => (
                              <MenuItem key={opt} itemId={opt} isSelected={repository === opt}>{opt}</MenuItem>
                            ))
                          )}
                        </MenuList>
                      </MenuContent>
                    </Menu>
                  }
                  menuRef={repoMenuRef}
                  toggle={
                    <MenuToggle ref={repoToggleRef} onClick={() => setRepoOpen(!repoOpen)} isExpanded={repoOpen} aria-label="Repository filter">
                      {repository}
                    </MenuToggle>
                  }
                  toggleRef={repoToggleRef}
                  isOpen={repoOpen}
                  onOpenChange={(open) => { setRepoOpen(open); if (!open) setRepoFilter(''); }}
                />
              </ToolbarItem>

              <ToolbarItem style={{ flex: '0 0 auto', width: 320, maxWidth: 'min(480px, 100%)' }}>
                <SearchInput
                  placeholder="Filter…"
                  value={searchDraft}
                  onChange={(_e, v) => setSearchDraft(v)}
                  onClear={() => { setSearchDraft(''); setSearchQuery(''); setPage(1); }}
                  onSearch={(_e, value) => { setSearchQuery(value); setPage(1); }}
                  aria-label="Filter deb packages"
                />
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsMd' }}>
              <ToolbarItem>
                <Checkbox
                  id="deb-filter-applicable"
                  label="Applicable"
                  isChecked={filterApplicable}
                  onChange={(_e, checked) => { setFilterApplicable(checked); setPage(1); }}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Checkbox
                  id="deb-filter-upgradable"
                  label="Upgradable"
                  isChecked={filterUpgradable}
                  onChange={(_e, checked) => { setFilterUpgradable(checked); setPage(1); }}
                />
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup align={{ default: 'alignRight' }}>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={itemCount} perPage={perPage} page={safePage}
                  onSetPage={(_e, nextPage) => setPage(nextPage)}
                  onPerPageSelect={(_e, nextPerPage, nextPage) => { setPerPage(nextPerPage); setPage(nextPage); }}
                  variant={PaginationVariant.top} titles={paginationTitles}
                  toggleTemplate={({ firstIndex, lastIndex, itemCount: total }) => <span>{firstIndex} - {lastIndex} of {total}</span>}
                  isCompact ouiaId="deb-packages-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Deb packages" variant="compact" borders ouiaId="deb-packages-table" style={{ marginBottom: 0, width: '100%' }}>
          <Thead>
            <Tr>
              <Th style={thNowrap}>Name</Th>
              <Th style={thNowrap}>Version</Th>
              <Th style={thNowrap}>Architecture</Th>
              <Th style={{ ...thNowrap, minWidth: '14rem' }}>Hosts</Th>
            </Tr>
          </Thead>
          <Tbody>
            {slice.length === 0 ? (
              <Tr>
                <Td colSpan={4} dataLabel="Empty">No deb packages match the current filters.</Td>
              </Tr>
            ) : (
              slice.map((row, rowIndex) => (
                <Tr key={row.id} isStriped={rowIndex % 2 === 1}>
                  <Td dataLabel="Name">
                    <Link to={`/deb-packages/${encodeURIComponent(row.name)}`} style={{ textDecoration: 'none' }}>{row.name}</Link>
                  </Td>
                  <Td dataLabel="Version">{row.version}</Td>
                  <Td dataLabel="Architecture">{row.architecture}</Td>
                  <Td dataLabel="Hosts">{hostsLabel(row)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>

        <Pagination
          itemCount={itemCount} perPage={perPage} page={safePage}
          onSetPage={(_e, nextPage) => setPage(nextPage)}
          onPerPageSelect={(_e, nextPerPage, nextPage) => { setPerPage(nextPerPage); setPage(nextPage); }}
          variant={PaginationVariant.bottom} titles={paginationTitles}
          toggleTemplate={({ firstIndex, lastIndex, itemCount: total }) => <span>{firstIndex} - {lastIndex} of {total}</span>}
          isCompact isStatic ouiaId="deb-packages-pagination-bottom"
          style={{ marginTop: 0, paddingTop: spacingMd, paddingBlockStart: spacingMd, paddingLeft: 0, paddingRight: 0, paddingInline: 0 }}
        />
      </section>
    </PageSection>
  );
};

export { DebPackages };
