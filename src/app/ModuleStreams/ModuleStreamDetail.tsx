import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  ClipboardCopy,
  ClipboardCopyVariant,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Flex,
  PageSection,
  SearchInput,
  Text,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import tabStyles from '@patternfly/react-styles/css/components/Tabs/tabs.mjs';
import tabContentStyles from '@patternfly/react-styles/css/components/TabContent/tab-content.mjs';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { getModuleStreamByName } from '@app/ModuleStreams/moduleStreamData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const spacingDetail = '14px';
const spacingSm = 'var(--pf-v5-global--spacer--sm, var(--pf-global--spacer--sm, 8px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const labelFieldGap = '8px';
const termStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 700, lineHeight: 1.5 };
const bodyTextStyle: React.CSSProperties = { fontSize: '14px', lineHeight: 1.5 };
const dlGroupStyle: React.CSSProperties = { rowGap: labelFieldGap, display: 'flex', flexDirection: 'column' };

const TAB_IDS = {
  repositories: 'ms-detail-tab-repositories',
  profiles: 'ms-detail-tab-profiles',
  artifacts: 'ms-detail-tab-artifacts',
} as const;

const PANEL_IDS = {
  repositories: 'ms-detail-panel-repositories',
  profiles: 'ms-detail-panel-profiles',
  artifacts: 'ms-detail-panel-artifacts',
} as const;

type TabKey = 'repositories' | 'profiles' | 'artifacts';

const MOCK_REPOS = [
  { name: 'RHEL 8 BaseOS', product: 'Red Hat Enterprise Linux 8', syncStatus: 'Synced', contentCount: 1024 },
  { name: 'RHEL 8 AppStream', product: 'Red Hat Enterprise Linux 8', syncStatus: 'Synced', contentCount: 3842 },
];

const MOCK_ARTIFACTS = [
  '389-ds-base-0:1.4.3.28-8.module+el8.7.0+16529+0474fcba.x86_64',
  '389-ds-base-libs-0:1.4.3.28-8.module+el8.7.0+16529+0474fcba.x86_64',
  '389-ds-base-devel-0:1.4.3.28-8.module+el8.7.0+16529+0474fcba.x86_64',
  'python3-lib389-0:1.4.3.28-8.module+el8.7.0+16529+0474fcba.noarch',
];

const tablePadded: React.CSSProperties = {
  paddingLeft: spacingL,
  paddingRight: spacingL,
  boxSizing: 'border-box',
  fontSize: '14px',
};

const ModuleStreamDetail: React.FunctionComponent = () => {
  const { moduleStreamId: rawParam } = useParams<{ moduleStreamId: string }>();
  const name = rawParam ? decodeURIComponent(rawParam) : '';
  const ms = getModuleStreamByName(name);

  const displayName = ms?.name ?? (name || 'Module Stream');
  useDocumentTitle(`PatternFly Seed | ${displayName}`);

  const [activeTabKey, setActiveTabKey] = React.useState<TabKey>('repositories');
  const [repoSearch, setRepoSearch] = React.useState('');

  const filteredRepos = React.useMemo(() => {
    const q = repoSearch.trim().toLowerCase();
    if (!q) return MOCK_REPOS;
    return MOCK_REPOS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        r.syncStatus.toLowerCase().includes(q),
    );
  }, [repoSearch]);

  if (!ms) {
    return (
      <PageSection aria-label="Module stream detail">
        <TextContent>
          <Title headingLevel="h1" size="2xl">Module stream not found</Title>
          <Text component="p">No module stream matches <strong>{name || 'this URL'}</strong>.</Text>
          <Link to="/module-streams">Back to module streams</Link>
        </TextContent>
      </PageSection>
    );
  }

  const inlineFields = (
    <Flex
      flexWrap={{ default: 'wrap' }}
      alignItems={{ default: 'alignItemsFlexStart' }}
      justifyContent={{ default: 'justifyContentFlexStart' }}
      style={{ marginTop: spacingDetail, gap: spacingDetail }}
    >
      <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Stream</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{ms.stream}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Version</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{ms.version}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Arch</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{ms.arch}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Context</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{ms.context}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Flex>
  );

  const descriptionBlock = (
    <DescriptionList aria-label="Description" style={{ marginTop: spacingDetail }}>
      <DescriptionListGroup style={dlGroupStyle}>
        <DescriptionListTerm style={termStyle}>Description</DescriptionListTerm>
        <DescriptionListDescription style={bodyTextStyle}>{ms.description}</DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );

  const reposSection = (
    <div style={tablePadded}>
      <Toolbar
        id="ms-detail-repos-toolbar"
        ouiaId="ms-detail-repos-toolbar"
        inset={{ default: 'insetNone' }}
        style={{ marginBottom: 0, paddingLeft: 0, paddingRight: 0 }}
      >
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <SearchInput
                placeholder="Search repositories…"
                value={repoSearch}
                onChange={(_e, v) => setRepoSearch(v)}
                onClear={() => setRepoSearch('')}
                aria-label="Search repositories"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Table aria-label="Repositories" variant="compact" borders ouiaId="ms-detail-repos-table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Product</Th>
            <Th>Sync status</Th>
            <Th>Content count</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredRepos.length === 0 ? (
            <Tr>
              <Td colSpan={4} dataLabel="Empty">No repositories match the current filter.</Td>
            </Tr>
          ) : (
            filteredRepos.map((r, i) => (
              <Tr key={r.name} isStriped={i % 2 === 1}>
                <Td dataLabel="Name">{r.name}</Td>
                <Td dataLabel="Product">{r.product}</Td>
                <Td dataLabel="Sync status">{r.syncStatus}</Td>
                <Td dataLabel="Content count">{r.contentCount}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  );

  const profilesEmpty = (
    <div style={tablePadded}>
      <EmptyState
        variant={EmptyStateVariant.sm}
        icon={CubesIcon}
        titleText="No profiles available"
        headingLevel="h4"
      >
        <EmptyStateBody>
          There are no profiles associated with this module stream.
        </EmptyStateBody>
      </EmptyState>
    </div>
  );

  const artifactsTable = (
    <div style={{ ...tablePadded, paddingTop: spacingMd }}>
      <Table aria-label="Artifacts" variant="compact" borders ouiaId="ms-detail-artifacts-table">
        <Thead>
          <Tr>
            <Th>Artifact</Th>
          </Tr>
        </Thead>
        <Tbody>
          {MOCK_ARTIFACTS.map((a, i) => (
            <Tr key={a} isStriped={i % 2 === 1}>
              <Td dataLabel="Artifact">{a}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );

  const renderTab = (key: TabKey, label: string) => (
    <li className={css(tabStyles.tabsItem, activeTabKey === key && tabStyles.modifiers.current)} role="presentation">
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
        <span className={css(tabStyles.tabsItemText)}>{label}</span>
      </button>
    </li>
  );

  return (
    <PageSection
      aria-label="Module stream detail"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      {/* Breadcrumb */}
      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: 0, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <Breadcrumb>
          <BreadcrumbItem
            to="/module-streams"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/module-streams" aria-current={ariaCurrent}>Module Streams</Link>
            )}
          />
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Title + copyable UUID */}
      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: spacingSm, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <TextContent style={bodyTextStyle}>
          <Title headingLevel="h1" size="2xl">{displayName}</Title>
        </TextContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacingSm, marginTop: spacingSm }}>
          <span style={{ ...termStyle, whiteSpace: 'nowrap' }}>UUID:</span>
          <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied" variant={ClipboardCopyVariant.inline}>
            {ms.uuid}
          </ClipboardCopy>
        </div>
      </div>

      {/* Detail fields */}
      <div style={{ paddingRight: spacingL, paddingBottom: spacingDetail, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <TextContent style={bodyTextStyle}>
          {inlineFields}
          {descriptionBlock}
        </TextContent>
      </div>

      {/* Tabs */}
      <div style={{ paddingTop: 0, paddingRight: spacingL, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <div className={css(tabStyles.tabs)} aria-label="Module stream detail tabs">
          <ul className={css(tabStyles.tabsList)} role="tablist">
            {renderTab('repositories', 'Repositories')}
            {renderTab('profiles', 'Profiles')}
            {renderTab('artifacts', 'Artifacts')}
          </ul>
        </div>
      </div>

      {/* Tab panels */}
      <div style={{ paddingBottom: spacingL, boxSizing: 'border-box' }}>
        <section id={PANEL_IDS.repositories} role="tabpanel" aria-labelledby={TAB_IDS.repositories} className={css(tabContentStyles.tabContent)} style={{ padding: 0 }} hidden={activeTabKey !== 'repositories'} tabIndex={0}>
          {reposSection}
        </section>
        <section id={PANEL_IDS.profiles} role="tabpanel" aria-labelledby={TAB_IDS.profiles} className={css(tabContentStyles.tabContent)} style={{ padding: 0 }} hidden={activeTabKey !== 'profiles'} tabIndex={0}>
          {profilesEmpty}
        </section>
        <section id={PANEL_IDS.artifacts} role="tabpanel" aria-labelledby={TAB_IDS.artifacts} className={css(tabContentStyles.tabContent)} style={{ padding: 0 }} hidden={activeTabKey !== 'artifacts'} tabIndex={0}>
          {artifactsTable}
        </section>
      </div>
    </PageSection>
  );
};

export { ModuleStreamDetail };
