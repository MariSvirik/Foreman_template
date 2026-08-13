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
  SearchInput,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { OutlinedBookmarkIcon } from '@patternfly/react-icons';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { MOCK_CONTENT_CREDENTIALS } from './contentCredentialData';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const thNowrap: React.CSSProperties = { whiteSpace: 'nowrap' };

const ContentCredentials: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [search, setSearch] = React.useState('');
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);

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
        applySavedBookmarkQuery('Certificate');
        break;
      case 'saved-b2':
        applySavedBookmarkQuery('GPG');
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

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_CONTENT_CREDENTIALS;
    return MOCK_CONTENT_CREDENTIALS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.organization.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q),
    );
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const itemCount = filtered.length;

  return (
    <PageSection
      aria-label="Content Credentials"
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
                Content Credentials
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </section>

      <section
        aria-label="Content Credentials list"
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Toolbar
          id="content-credentials-toolbar"
          ouiaId="content-credentials-toolbar"
          inset={{ default: 'insetNone' }}
          style={{ marginBottom: 0 }}
        >
          <ToolbarContent alignItems="center">
            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem style={{ flex: '0 0 auto', width: 420, maxWidth: 'min(560px, 100%)' }}>
                <InputGroup>
                  <InputGroupItem isFill>
                    <SearchInput
                      placeholder="Filter..."
                      value={search}
                      onChange={(_e, v) => setSearch(v)}
                      onClear={() => {
                        setSearch('');
                        setPage(1);
                      }}
                      onSearch={() => setPage(1)}
                      aria-label="Filter content credentials"
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
                <Button variant="primary">Create content credential</Button>
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
                  ouiaId="content-credentials-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table
          aria-label="Content Credentials data"
          variant="compact"
          borders
          isStriped
          ouiaId="content-credentials-table"
          style={{ marginBottom: 0, width: '100%', tableLayout: 'fixed' }}
        >
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '21%' }} />
          </colgroup>
          <Thead>
            <Tr>
              <Th style={thNowrap}>Name</Th>
              <Th style={thNowrap}>Organization</Th>
              <Th style={thNowrap}>Type</Th>
              <Th style={thNowrap}>Products</Th>
              <Th style={thNowrap}>Repositories</Th>
              <Th style={thNowrap}>Alternate content sources</Th>
            </Tr>
          </Thead>
          <Tbody>
            {slice.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel="Name">
                  <Button variant="link" isInline>{row.name}</Button>
                </Td>
                <Td dataLabel="Organization">{row.organization}</Td>
                <Td dataLabel="Type">{row.type}</Td>
                <Td dataLabel="Products">{row.products}</Td>
                <Td dataLabel="Repositories">{row.repositories}</Td>
                <Td dataLabel="Alternate content sources">{row.alternateContentSources}</Td>
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
          ouiaId="content-credentials-pagination-bottom"
          style={{
            marginTop: spacingMd,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingInline: 0,
          }}
        />
      </section>
    </PageSection>
  );
};

export { ContentCredentials };
