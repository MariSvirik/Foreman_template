import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Flex,
  FlexItem,
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
import { getPackageDetail } from '@app/Packages/packageData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const spacingDetail = '14px';
const spacingSm = 'var(--pf-v5-global--spacer--sm, var(--pf-global--spacer--sm, 8px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const labelFieldGap = '8px';
const termStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: 1.5,
};
const bodyTextStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.5,
};
const dlGroupStyle: React.CSSProperties = {
  rowGap: labelFieldGap,
  display: 'flex',
  flexDirection: 'column',
};

/** Vertical gap between description-list groups (16px, not default 24px). */
const dlListStyle: React.CSSProperties = {
  rowGap: spacingMd,
};

const TAB_IDS = {
  details: 'package-detail-tab-details',
  files: 'package-detail-tab-files',
  dependencies: 'package-detail-tab-dependencies',
  repositories: 'package-detail-tab-repositories',
} as const;

const PANEL_IDS = {
  details: 'package-detail-panel-details',
  files: 'package-detail-panel-files',
  dependencies: 'package-detail-panel-dependencies',
  repositories: 'package-detail-panel-repositories',
} as const;

const MOCK_FILES = [
  { path: '/etc/sysconfig/base', mode: '-rw-r--r--' },
  { path: '/usr/share/doc/basesystem/README', mode: '-rw-r--r--' },
];

const MOCK_DEPS = [
  { name: 'setup', type: 'Requires' },
  { name: 'filesystem', type: 'Requires' },
];

const MOCK_REPOS = [
  { name: 'RHEL 9 BaseOS', type: 'yum', lastSync: '2026-04-01' },
  { name: 'RHEL 9 AppStream', type: 'yum', lastSync: '2026-04-01' },
];

type TabKey = 'details' | 'files' | 'dependencies' | 'repositories';

function hostCountLinkLabel(n: number): string {
  return `${n} host(s)`;
}

const PackageDetail: React.FunctionComponent = () => {
  const { packageId: rawParam } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const nevra = rawParam ? decodeURIComponent(rawParam) : '';

  const pkg = getPackageDetail(nevra);

  const [activeTabKey, setActiveTabKey] = React.useState<TabKey>('details');
  const [toolbarSearch, setToolbarSearch] = React.useState('');

  React.useEffect(() => {
    setToolbarSearch('');
  }, [activeTabKey]);

  const displayNevra = pkg?.nevra ?? (nevra || 'Package');

  useDocumentTitle(`PatternFly Seed | ${displayNevra}`);

  const toolbarPlaceholder =
    activeTabKey === 'files'
      ? 'Search files…'
      : activeTabKey === 'dependencies'
        ? 'Search dependencies…'
        : 'Search repositories…';

  const filteredFiles = React.useMemo(() => {
    const q = toolbarSearch.trim().toLowerCase();
    if (!q) {
      return MOCK_FILES;
    }
    return MOCK_FILES.filter((f) => f.path.toLowerCase().includes(q) || f.mode.toLowerCase().includes(q));
  }, [toolbarSearch]);

  const filteredDeps = React.useMemo(() => {
    const q = toolbarSearch.trim().toLowerCase();
    if (!q) {
      return MOCK_DEPS;
    }
    return MOCK_DEPS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q),
    );
  }, [toolbarSearch]);

  const filteredRepos = React.useMemo(() => {
    const q = toolbarSearch.trim().toLowerCase();
    if (!q) {
      return MOCK_REPOS;
    }
    return MOCK_REPOS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.lastSync.toLowerCase().includes(q),
    );
  }, [toolbarSearch]);

  const tablePadded = {
    paddingLeft: spacingL,
    paddingRight: spacingL,
    boxSizing: 'border-box' as const,
    fontSize: '14px',
  };

  const tabToolbar = (
    <Toolbar
      id="package-detail-toolbar"
      ouiaId="package-detail-toolbar"
      inset={{ default: 'insetNone' }}
      style={{ marginBottom: 0, paddingLeft: 0, paddingRight: 0 }}
    >
      <ToolbarContent>
        <ToolbarGroup>
          <ToolbarItem>
            <SearchInput
              placeholder={toolbarPlaceholder}
              value={toolbarSearch}
              onChange={(_e, v) => setToolbarSearch(v)}
              onClear={() => setToolbarSearch('')}
              aria-label="Search tab content"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary">
              {activeTabKey === 'files'
                ? 'Upload file'
                : activeTabKey === 'dependencies'
                  ? 'Add dependency'
                  : 'Add repository'}
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const filesTable = (
    <div style={tablePadded}>
      <Table aria-label="Package files" variant="compact" borders ouiaId="package-detail-files-table">
        <Thead>
          <Tr>
            <Th>Path</Th>
            <Th>Mode</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredFiles.map((f) => (
            <Tr key={f.path}>
              <Td dataLabel="Path">
                <code>{f.path}</code>
              </Td>
              <Td dataLabel="Mode">{f.mode}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );

  const depsTable = (
    <div style={tablePadded}>
      <Table
        aria-label="Package dependencies"
        variant="compact"
        borders
        ouiaId="package-detail-dependencies-table"
      >
        <Thead>
          <Tr>
            <Th>Package</Th>
            <Th>Relationship</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredDeps.map((d) => (
            <Tr key={`${d.type}-${d.name}`}>
              <Td dataLabel="Package">{d.name}</Td>
              <Td dataLabel="Relationship">{d.type}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );

  const reposTable = (
    <div style={tablePadded}>
      <Table
        aria-label="Package repositories"
        variant="compact"
        borders
        ouiaId="package-detail-repositories-table"
      >
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Last sync</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredRepos.map((r) => (
            <Tr key={r.name}>
              <Td dataLabel="Name">{r.name}</Td>
              <Td dataLabel="Type">{r.type}</Td>
              <Td dataLabel="Last sync">{r.lastSync}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );

  if (!pkg) {
    return (
      <PageSection aria-label="Package detail">
        <TextContent>
          <Title headingLevel="h1" size="2xl">
            Package not found
          </Title>
          <Text component="p">
            No package matches <strong>{nevra || 'this URL'}</strong>.
          </Text>
          <Button variant="link" isInline onClick={() => navigate('/packages')}>
            Back to packages
          </Button>
        </TextContent>
      </PageSection>
    );
  }

  const hostLink = (count: number) => (
    <Button variant="link" isInline onClick={() => navigate('/hosts/create')}>
      {hostCountLinkLabel(count)}
    </Button>
  );

  const detailsPanel = (
    <div style={{ paddingLeft: spacingL, paddingRight: spacingL, paddingTop: spacingMd }}>
      <Flex
        direction={{ default: 'column', lg: 'row' }}
        flexWrap={{ default: 'nowrap' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        alignItems={{ default: 'alignItemsFlexStart' }}
        style={{ gap: spacingL }}
      >
        <FlexItem flex={{ default: 'flex_1' }}>
          <Title headingLevel="h2" size="lg" style={{ marginBottom: spacingSm }}>
            Package information
          </Title>
          <DescriptionList aria-label="Remaining package fields" style={dlListStyle}>
            <DescriptionListGroup style={dlGroupStyle}>
              <DescriptionListTerm style={termStyle}>Group</DescriptionListTerm>
              <DescriptionListDescription>{pkg.group}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup style={dlGroupStyle}>
              <DescriptionListTerm style={termStyle}>License</DescriptionListTerm>
              <DescriptionListDescription>{pkg.license}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup style={dlGroupStyle}>
              <DescriptionListTerm style={termStyle}>URL</DescriptionListTerm>
              <DescriptionListDescription>{pkg.url || '—'}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup style={dlGroupStyle}>
              <DescriptionListTerm style={termStyle}>Modular</DescriptionListTerm>
              <DescriptionListDescription>{pkg.modular}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
        <FlexItem flex={{ default: 'flex_1' }}>
          <Title headingLevel="h2" size="lg" style={{ marginBottom: spacingSm }}>
            Build information
          </Title>
          <DescriptionList aria-label="Build information" style={dlListStyle}>
            <DescriptionListGroup style={dlGroupStyle}>
              <DescriptionListTerm style={termStyle}>Source RPM</DescriptionListTerm>
              <DescriptionListDescription>
                <Text component="p">{pkg.sourceRpm}</Text>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup style={dlGroupStyle}>
              <DescriptionListTerm style={termStyle}>Build host</DescriptionListTerm>
              <DescriptionListDescription>{pkg.buildHost}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup style={dlGroupStyle}>
              <DescriptionListTerm style={termStyle}>Build time</DescriptionListTerm>
              <DescriptionListDescription>{pkg.buildTime}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
      </Flex>

      <Divider style={{ marginTop: spacingL, marginBottom: spacingL }} />

      <Title headingLevel="h2" size="lg" style={{ marginBottom: spacingSm }}>
        File information
      </Title>
      <DescriptionList aria-label="File information" style={dlListStyle}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Size</DescriptionListTerm>
          <DescriptionListDescription>{pkg.fileSizeLabel}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Filename</DescriptionListTerm>
          <DescriptionListDescription>
            <Text component="p">{pkg.fileName}</Text>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Checksum</DescriptionListTerm>
          <DescriptionListDescription>
            <Text component="p" style={{ wordBreak: 'break-all' }}>
              {pkg.checksum}
            </Text>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Checksum type</DescriptionListTerm>
          <DescriptionListDescription>{pkg.checksumType}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </div>
  );

  return (
    <PageSection
      aria-label="Package detail"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      {/* 1. Breadcrumb — Template detail rhythm (16px top, 24px sides) */}
      <div
        style={{
          paddingTop: spacingMd,
          paddingRight: spacingL,
          paddingBottom: 0,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Breadcrumb>
          <BreadcrumbItem
            to="/packages"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/packages" aria-current={ariaCurrent}>
                Packages
              </Link>
            )}
          />
          <BreadcrumbItem isActive>{displayNevra}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* 2. Title + summary + hosts + description — Errata detail stacking */}
      <div
        style={{
          paddingTop: spacingMd,
          paddingRight: spacingL,
          paddingBottom: spacingMd,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <TextContent style={bodyTextStyle}>
          <Title headingLevel="h1" size="2xl">
            {displayNevra}
          </Title>
          <Text component="p" style={{ marginTop: spacingSm }}>
            {pkg.summary}
          </Text>

          <Flex
            flexWrap={{ default: 'wrap' }}
            alignItems={{ default: 'alignItemsFlexStart' }}
            justifyContent={{ default: 'justifyContentFlexStart' }}
            style={{ marginTop: spacingDetail, gap: spacingDetail }}
          >
            <DescriptionList style={{ flex: '1 1 10rem', minWidth: '9rem', marginBottom: 0, ...dlListStyle }}>
              <DescriptionListGroup style={dlGroupStyle}>
                <DescriptionListTerm style={termStyle}>Installed on</DescriptionListTerm>
                <DescriptionListDescription>{hostLink(pkg.installedHosts)}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
            <DescriptionList style={{ flex: '1 1 10rem', minWidth: '9rem', marginBottom: 0, ...dlListStyle }}>
              <DescriptionListGroup style={dlGroupStyle}>
                <DescriptionListTerm style={termStyle}>Applicable to</DescriptionListTerm>
                <DescriptionListDescription>{hostLink(pkg.applicable)}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
            <DescriptionList style={{ flex: '1 1 10rem', minWidth: '9rem', marginBottom: 0, ...dlListStyle }}>
              <DescriptionListGroup style={dlGroupStyle}>
                <DescriptionListTerm style={termStyle}>Upgradable for</DescriptionListTerm>
                <DescriptionListDescription>{hostLink(pkg.upgradable)}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </Flex>

          <div style={{ marginTop: spacingDetail }} aria-label="Package description">
            <DescriptionList style={dlListStyle}>
              <DescriptionListGroup style={dlGroupStyle}>
                <DescriptionListTerm style={termStyle}>Description</DescriptionListTerm>
                <DescriptionListDescription>
                  <Text component="p">{pkg.description}</Text>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </div>
        </TextContent>
      </div>

      {/* 3. Tabs — Template detail tab list only */}
      <div
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <div className={css(tabStyles.tabs)} aria-label="Package detail tabs">
          <ul className={css(tabStyles.tabsList)} role="tablist">
            <li
              className={css(tabStyles.tabsItem, activeTabKey === 'details' && tabStyles.modifiers.current)}
              role="presentation"
            >
              <button
                type="button"
                id={TAB_IDS.details}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={activeTabKey === 'details'}
                aria-controls={PANEL_IDS.details}
                tabIndex={activeTabKey === 'details' ? 0 : -1}
                onClick={() => setActiveTabKey('details')}
              >
                <span className={css(tabStyles.tabsItemText)}>Details</span>
              </button>
            </li>
            <li
              className={css(tabStyles.tabsItem, activeTabKey === 'files' && tabStyles.modifiers.current)}
              role="presentation"
            >
              <button
                type="button"
                id={TAB_IDS.files}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={activeTabKey === 'files'}
                aria-controls={PANEL_IDS.files}
                tabIndex={activeTabKey === 'files' ? 0 : -1}
                onClick={() => setActiveTabKey('files')}
              >
                <span className={css(tabStyles.tabsItemText)}>Files</span>
              </button>
            </li>
            <li
              className={css(
                tabStyles.tabsItem,
                activeTabKey === 'dependencies' && tabStyles.modifiers.current,
              )}
              role="presentation"
            >
              <button
                type="button"
                id={TAB_IDS.dependencies}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={activeTabKey === 'dependencies'}
                aria-controls={PANEL_IDS.dependencies}
                tabIndex={activeTabKey === 'dependencies' ? 0 : -1}
                onClick={() => setActiveTabKey('dependencies')}
              >
                <span className={css(tabStyles.tabsItemText)}>Dependencies</span>
              </button>
            </li>
            <li
              className={css(
                tabStyles.tabsItem,
                activeTabKey === 'repositories' && tabStyles.modifiers.current,
              )}
              role="presentation"
            >
              <button
                type="button"
                id={TAB_IDS.repositories}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={activeTabKey === 'repositories'}
                aria-controls={PANEL_IDS.repositories}
                tabIndex={activeTabKey === 'repositories' ? 0 : -1}
                onClick={() => setActiveTabKey('repositories')}
              >
                <span className={css(tabStyles.tabsItemText)}>Repositories</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Toolbar — Errata-style; hidden on Details tab */}
      {activeTabKey !== 'details' && (
        <div
          style={{
            paddingLeft: spacingL,
            paddingRight: spacingL,
            boxSizing: 'border-box',
            fontSize: '14px',
          }}
        >
          {tabToolbar}
        </div>
      )}

      {/* 4. Tab panels — Template detail bottom padding */}
      <div
        style={{
          paddingBottom: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <section
          id={PANEL_IDS.details}
          role="tabpanel"
          aria-labelledby={TAB_IDS.details}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'details'}
          tabIndex={0}
        >
          {detailsPanel}
        </section>

        <section
          id={PANEL_IDS.files}
          role="tabpanel"
          aria-labelledby={TAB_IDS.files}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'files'}
          tabIndex={0}
        >
          {filesTable}
        </section>

        <section
          id={PANEL_IDS.dependencies}
          role="tabpanel"
          aria-labelledby={TAB_IDS.dependencies}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'dependencies'}
          tabIndex={0}
        >
          {depsTable}
        </section>

        <section
          id={PANEL_IDS.repositories}
          role="tabpanel"
          aria-labelledby={TAB_IDS.repositories}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'repositories'}
          tabIndex={0}
        >
          {reposTable}
        </section>
      </div>
    </PageSection>
  );
};

export { PackageDetail };
