import * as React from 'react';
import {
  Button,
  Level,
  LevelItem,
  MenuToggle,
  PageSection,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  TextContent,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { MOCK_PACKAGES } from '@app/Packages/packageData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useNavigate } from 'react-router-dom';

/**
 * PF5 tokens with pixel fallbacks — matches Template index / Errata list pages.
 */
const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';
const rowAltBg = 'var(--pf-v5-global--BackgroundColor--150, var(--pf-global--BackgroundColor--150, #f2f2f2))';

const REPOSITORY_OPTIONS = ['All repositories', 'BaseOS', 'AppStream', 'Custom RPM'] as const;

const Packages: React.FunctionComponent = () => {
  useDocumentTitle('PatternFly Seed | Packages');
  const navigate = useNavigate();

  const [repository, setRepository] = React.useState<string>(REPOSITORY_OPTIONS[0]);
  const [repoOpen, setRepoOpen] = React.useState(false);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterApplicable, setFilterApplicable] = React.useState(false);
  const [filterUpgradable, setFilterUpgradable] = React.useState(false);

  const filtered = React.useMemo(() => {
    let rows = [...MOCK_PACKAGES];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) => r.nevra.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q),
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

  const hostCountsLabel = (r: (typeof MOCK_PACKAGES)[number]) =>
    `${r.applicable} applicable, ${r.upgradable} upgradable`;

  return (
    <PageSection
      aria-label="Packages"
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
                Packages
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
          id="packages-toolbar"
          ouiaId="packages-toolbar"
          inset={{ default: 'insetNone' }}
          style={{ marginBottom: 0 }}
        >
          <ToolbarContent>
            <ToolbarGroup alignItems="center">
              <ToolbarItem>
                <Select
                  isOpen={repoOpen}
                  selected={repository}
                  onSelect={(_e, value) => {
                    if (typeof value === 'string') {
                      setRepository(value);
                    }
                    setRepoOpen(false);
                  }}
                  onOpenChange={setRepoOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setRepoOpen(!repoOpen)}
                      isExpanded={repoOpen}
                      aria-label="Repository filter"
                    >
                      {repository}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {REPOSITORY_OPTIONS.map((opt) => (
                      <SelectOption key={opt} value={opt}>
                        {opt}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </ToolbarItem>
              <ToolbarItem>
                <SearchInput
                  placeholder="Filter…"
                  value={searchDraft}
                  onChange={(_e, v) => setSearchDraft(v)}
                  onClear={() => {
                    setSearchDraft('');
                    setSearchQuery('');
                  }}
                  onSearch={(_e, value) => setSearchQuery(value)}
                  aria-label="Filter packages"
                />
              </ToolbarItem>
              <ToolbarItem
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  minHeight: 'var(--pf-v5-c-menu-toggle--MinHeight, 2.25rem)',
                }}
              >
                <ToggleGroup
                  aria-label="Filter by host package state"
                  style={{
                    alignSelf: 'stretch',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'stretch',
                  }}
                >
                  <ToggleGroupItem
                    text="Applicable"
                    buttonId="packages-filter-applicable"
                    isSelected={filterApplicable}
                    onChange={(_e, selected) => setFilterApplicable(selected)}
                  />
                  <ToggleGroupItem
                    text="Upgradable"
                    buttonId="packages-filter-upgradable"
                    isSelected={filterUpgradable}
                    onChange={(_e, selected) => setFilterUpgradable(selected)}
                  />
                </ToggleGroup>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table
          aria-label="Packages"
          variant="compact"
          borders
          ouiaId="packages-table"
          style={{ marginBottom: 0 }}
        >
          <Thead>
            <Tr>
              <Th>RPM package</Th>
              <Th>Summary</Th>
              <Th>Content host counts</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr>
                <Td colSpan={3} dataLabel="Empty">
                  No packages match the current filters.
                </Td>
              </Tr>
            ) : (
              filtered.map((row, index) => (
                <Tr
                  key={row.id}
                  style={{
                    backgroundColor: index % 2 === 1 ? rowAltBg : undefined,
                  }}
                >
                  <Td dataLabel="RPM package">
                    <Button
                      variant="link"
                      isInline
                      onClick={() =>
                        navigate(`/packages/${encodeURIComponent(row.nevra)}`)
                      }
                    >
                      {row.nevra}
                    </Button>
                  </Td>
                  <Td dataLabel="Summary">{row.summary}</Td>
                  <Td dataLabel="Content host counts">{hostCountsLabel(row)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>
    </PageSection>
  );
};

export { Packages };
