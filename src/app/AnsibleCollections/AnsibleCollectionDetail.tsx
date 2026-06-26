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
import { getAnsibleCollectionByName } from '@app/AnsibleCollections/ansibleCollectionData';
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
  repositories: 'ac-detail-tab-repositories',
} as const;

const PANEL_IDS = {
  repositories: 'ac-detail-panel-repositories',
} as const;

const MOCK_REPOS = [
  { name: 'RHEL 8 Ansible Collections', type: 'yum', product: 'Red Hat Enterprise Linux 8', lastSync: '2026-04-01' },
  { name: 'Custom Ansible Repo', type: 'yum', product: 'Custom Products', lastSync: '2026-03-25' },
];

const tablePadded: React.CSSProperties = {
  paddingLeft: spacingL,
  paddingRight: spacingL,
  boxSizing: 'border-box',
  fontSize: '14px',
};

const AnsibleCollectionDetail: React.FunctionComponent = () => {
  const { collectionId: rawParam } = useParams<{ collectionId: string }>();
  const name = rawParam ? decodeURIComponent(rawParam) : '';
  const collection = getAnsibleCollectionByName(name);

  const displayName = collection?.name ?? (name || 'Ansible Collection');
  useDocumentTitle(`PatternFly Seed | ${displayName}`);

  const [repoSearch, setRepoSearch] = React.useState('');

  const filteredRepos = React.useMemo(() => {
    const q = repoSearch.trim().toLowerCase();
    if (!q) return MOCK_REPOS;
    return MOCK_REPOS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q),
    );
  }, [repoSearch]);

  if (!collection) {
    return (
      <PageSection aria-label="Ansible collection detail">
        <TextContent>
          <Title headingLevel="h1" size="2xl">Collection not found</Title>
          <Text component="p">No collection matches <strong>{name || 'this URL'}</strong>.</Text>
          <Link to="/ansible-collections">Back to Ansible Collections</Link>
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
          <DescriptionListTerm style={termStyle}>Author</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{collection.author}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Version</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{collection.version}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
        <DescriptionListGroup style={dlGroupStyle}>
          <DescriptionListTerm style={termStyle}>Tags</DescriptionListTerm>
          <DescriptionListDescription style={bodyTextStyle}>{collection.tags}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Flex>
  );

  const checksumBlock = (
    <DescriptionList aria-label="Checksum" style={{ marginTop: spacingDetail }}>
      <DescriptionListGroup style={dlGroupStyle}>
        <DescriptionListTerm style={termStyle}>Checksum</DescriptionListTerm>
        <DescriptionListDescription style={bodyTextStyle}>{collection.checksum}</DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );

  const reposSection = (
    <div style={tablePadded}>
      <Toolbar
        id="ac-detail-repos-toolbar"
        ouiaId="ac-detail-repos-toolbar"
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
      <Table aria-label="Repositories" variant="compact" borders ouiaId="ac-detail-repos-table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Product</Th>
            <Th>Last sync</Th>
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
                <Td dataLabel="Type">{r.type}</Td>
                <Td dataLabel="Product">{r.product}</Td>
                <Td dataLabel="Last sync">{r.lastSync}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  );

  return (
    <PageSection
      aria-label="Ansible collection detail"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      {/* Breadcrumb */}
      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: 0, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <Breadcrumb>
          <BreadcrumbItem
            to="/ansible-collections"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/ansible-collections" aria-current={ariaCurrent}>Ansible Collections</Link>
            )}
          />
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Title + description (no label) */}
      <div style={{ paddingTop: spacingMd, paddingRight: spacingL, paddingBottom: spacingSm, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <TextContent style={bodyTextStyle}>
          <Title headingLevel="h1" size="2xl">{displayName}</Title>
          <Text component="p" style={{ marginTop: spacingSm }}>{collection.description}</Text>
        </TextContent>
      </div>

      {/* Detail fields */}
      <div style={{ paddingRight: spacingL, paddingBottom: spacingDetail, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <TextContent style={bodyTextStyle}>
          {inlineFields}
          {checksumBlock}
        </TextContent>
      </div>

      {/* Tabs — Repositories */}
      <div style={{ paddingTop: 0, paddingRight: spacingL, paddingLeft: spacingL, boxSizing: 'border-box' }}>
        <div className={css(tabStyles.tabs)} aria-label="Ansible collection detail tabs">
          <ul className={css(tabStyles.tabsList)} role="tablist">
            <li className={css(tabStyles.tabsItem, tabStyles.modifiers.current)} role="presentation">
              <button
                type="button"
                id={TAB_IDS.repositories}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected
                aria-controls={PANEL_IDS.repositories}
                tabIndex={0}
              >
                <span className={css(tabStyles.tabsItemText)}>Repositories</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab panel */}
      <div style={{ paddingBottom: spacingL, boxSizing: 'border-box' }}>
        <section id={PANEL_IDS.repositories} role="tabpanel" aria-labelledby={TAB_IDS.repositories} className={css(tabContentStyles.tabContent)} style={{ padding: 0 }} tabIndex={0}>
          {reposSection}
        </section>
      </div>
    </PageSection>
  );
};

export { AnsibleCollectionDetail };
