import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
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
import { css } from '@patternfly/react-styles';
import tabStyles from '@patternfly/react-styles/css/components/Tabs/tabs.mjs';
import tabContentStyles from '@patternfly/react-styles/css/components/TabContent/tab-content.mjs';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { getFileByName } from '@app/Files/fileData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const spacingDetail = '14px';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const labelFieldGap = '8px';
const termStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 700, lineHeight: 1.5 };
const bodyTextStyle: React.CSSProperties = { fontSize: '14px', lineHeight: 1.5 };
const dlGroupStyle: React.CSSProperties = { rowGap: labelFieldGap, display: 'flex', flexDirection: 'column' };

const TAB_IDS = {
  libraryRepositories: 'file-detail-tab-library-repositories',
  contentViews: 'file-detail-tab-content-views',
} as const;

const PANEL_IDS = {
  libraryRepositories: 'file-detail-panel-library-repositories',
  contentViews: 'file-detail-panel-content-views',
} as const;

type TabKey = 'libraryRepositories' | 'contentViews';

const MOCK_LIBRARY_REPOS = [
  { name: 'RHEL 8 BaseOS', type: 'yum', product: 'Red Hat Enterprise Linux 8', lastSync: '2026-04-01' },
  { name: 'RHEL 8 AppStream', type: 'yum', product: 'Red Hat Enterprise Linux 8', lastSync: '2026-04-01' },
  { name: 'Custom Files Repo', type: 'file', product: 'Custom Products', lastSync: '2026-03-28' },
];

const MOCK_CONTENT_VIEWS = [
  { name: 'Default Organization View', version: '1.0', environment: 'Library', published: '2026-01-15' },
  { name: 'Production CV', version: '3.2', environment: 'Production', published: '2026-03-20' },
  { name: 'Staging CV', version: '3.1', environment: 'Staging', published: '2026-03-10' },
];

const tablePadded: React.CSSProperties = {
  paddingLeft: spacingL,
  paddingRight: spacingL,
  boxSizing: 'border-box',
  fontSize: '14px',
};

const FileDetail: React.FunctionComponent = () => {
  const { fileId: rawParam } = useParams<{ fileId: string }>();
  const name = rawParam ? decodeURIComponent(rawParam) : '';
  const file = getFileByName(name);

  const displayName = file?.name ?? (name || 'File');
  useDocumentTitle(`PatternFly Seed | ${displayName}`);

  const [activeTabKey, setActiveTabKey] = React.useState<TabKey>('libraryRepositories');
  const [cvSearch, setCvSearch] = React.useState('');

  if (!file) {
    return (
      <PageSection aria-label="File detail">
        <TextContent>
          <Title headingLevel="h1" size="2xl">File not found</Title>
          <Text component="p">No file matches <strong>{name || 'this URL'}</strong>.</Text>
          <Link to="/files">Back to files</Link>
        </TextContent>
      </PageSection>
    );
  }

  const filteredContentViews = React.useMemo(() => {
    const q = cvSearch.trim().toLowerCase();
    if (!q) return MOCK_CONTENT_VIEWS;
    return MOCK_CONTENT_VIEWS.filter(
      (cv) =>
        cv.name.toLowerCase().includes(q) ||
        cv.version.toLowerCase().includes(q) ||
        cv.environment.toLowerCase().includes(q),
    );
  }, [cvSearch]);

  const inlineFields = (
    <Flex
      flexWrap={{ default: 'wrap' }}
      alignItems={{ default: 'alignItemsFlexStart' }}
      justifyContent={{ default: 'justifyContentFlexStart' }}
      style={{ marginTop: spacingDetail, gap: spacingDetail }}
    >
      <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Path</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{file.path}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <DescriptionList style={{ flex: '3 1 20rem', minWidth: '15rem', marginBottom: 0 }}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Checksum</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{file.checksum}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Flex>
  );

  const libraryReposTable = (
    <div style={{ ...tablePadded, paddingTop: spacingMd }}>
      <Table aria-label="Library repositories" variant="compact" borders ouiaId="file-detail-lib-repos-table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Product</Th>
            <Th>Last sync</Th>
          </Tr>
        </Thead>
        <Tbody>
          {MOCK_LIBRARY_REPOS.map((r, i) => (
            <Tr key={r.name} isStriped={i % 2 === 1}>
              <Td dataLabel="Name">{r.name}</Td>
              <Td dataLabel="Type">{r.type}</Td>
              <Td dataLabel="Product">{r.product}</Td>
              <Td dataLabel="Last sync">{r.lastSync}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );

  const contentViewsSection = (
    <div style={tablePadded}>
      <Toolbar
        id="file-detail-cv-toolbar"
        ouiaId="file-detail-cv-toolbar"
        inset={{ default: 'insetNone' }}
        style={{ marginBottom: 0, paddingLeft: 0, paddingRight: 0 }}
      >
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <SearchInput
                placeholder="Search content views…"
                value={cvSearch}
                onChange={(_e, v) => setCvSearch(v)}
                onClear={() => setCvSearch('')}
                aria-label="Search content views"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Table aria-label="Content views" variant="compact" borders ouiaId="file-detail-content-views-table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Version</Th>
            <Th>Environment</Th>
            <Th>Published</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredContentViews.length === 0 ? (
            <Tr>
              <Td colSpan={4} dataLabel="Empty">No content views match the current filter.</Td>
            </Tr>
          ) : (
            filteredContentViews.map((cv, i) => (
              <Tr key={cv.name} isStriped={i % 2 === 1}>
                <Td dataLabel="Name">{cv.name}</Td>
                <Td dataLabel="Version">{cv.version}</Td>
                <Td dataLabel="Environment">{cv.environment}</Td>
                <Td dataLabel="Published">{cv.published}</Td>
              </Tr>
            ))
          )}
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
      aria-label="File detail"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      {/* Breadcrumb */}
      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: 0, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <Breadcrumb>
          <BreadcrumbItem
            to="/files"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/files" aria-current={ariaCurrent}>Files</Link>
            )}
          />
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Title + inline detail fields */}
      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: spacingDetail, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <TextContent style={bodyTextStyle}>
          <Title headingLevel="h1" size="2xl">{displayName}</Title>
          {inlineFields}
        </TextContent>
      </div>

      {/* Tabs */}
      <div style={{ paddingTop: 0, paddingRight: spacingL, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <div className={css(tabStyles.tabs)} aria-label="File detail tabs">
          <ul className={css(tabStyles.tabsList)} role="tablist">
            {renderTab('libraryRepositories', 'Library repositories')}
            {renderTab('contentViews', 'Content views')}
          </ul>
        </div>
      </div>

      {/* Tab panels */}
      <div style={{ paddingBottom: spacingL, boxSizing: 'border-box' }}>
        <section id={PANEL_IDS.libraryRepositories} role="tabpanel" aria-labelledby={TAB_IDS.libraryRepositories} className={css(tabContentStyles.tabContent)} style={{ padding: 0 }} hidden={activeTabKey !== 'libraryRepositories'} tabIndex={0}>
          {libraryReposTable}
        </section>
        <section id={PANEL_IDS.contentViews} role="tabpanel" aria-labelledby={TAB_IDS.contentViews} className={css(tabContentStyles.tabContent)} style={{ padding: 0 }} hidden={activeTabKey !== 'contentViews'} tabIndex={0}>
          {contentViewsSection}
        </section>
      </div>
    </PageSection>
  );
};

export { FileDetail };
