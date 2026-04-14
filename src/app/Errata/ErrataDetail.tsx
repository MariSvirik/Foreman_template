import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
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
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { ErrataRow } from '@app/Errata/errataData';
import { findErrataByAdvisoryId } from '@app/Errata/errataData';
import {
  ErrataRebootIconLabel,
  ErrataSeverityIconLabel,
  ErrataTypeIconLabel,
} from '@app/Errata/errataVisuals';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
/** Detail page: 14px where PF would use md (16px) for padding, margin, and gaps. */
const spacingDetail = '14px';
const spacingSm = 'var(--pf-v5-global--spacer--sm, var(--pf-global--spacer--sm, 8px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';
/** Gap between description-list label (term) and value. */
const labelFieldGap = '8px';
/** Keep icon + value on one line inside description list values. */
const ddValueRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'nowrap',
  gap: labelFieldGap,
  minWidth: 0,
};
/**
 * Description list terms: PF body default size + line height (see Typography foundations).
 * 0.875rem (14px) × line-height 1.5 = 21px line box — matches standard body text.
 * @see https://www.patternfly.org/design-foundations/typography/
 */
const termStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: 1.5,
};
/** Body copy on detail page (PF default body is often 16px). */
const bodyTextStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.5,
};
const dlGroupStyle: React.CSSProperties = {
  rowGap: labelFieldGap,
  display: 'flex',
  flexDirection: 'column',
};

const TAB_IDS = {
  hosts: 'errata-detail-tab-hosts',
  repositories: 'errata-detail-tab-repositories',
  packages: 'errata-detail-tab-packages',
} as const;

const PANEL_IDS = {
  hosts: 'errata-detail-panel-hosts',
  repositories: 'errata-detail-panel-repositories',
  packages: 'errata-detail-panel-packages',
} as const;

const RSYNC_LONG = {
  description:
    'The rsync utility enables the users to copy and synchronize files locally or across a network. ' +
    'Synchronization with rsync is fast because rsync only sends the differences in files over the network ' +
    'instead of sending whole files. The rsync utility is also used as a mirroring tool.',
  securityFixes: ['rsync: Rsync: Out of bounds array access via negative index (CVE-2025-10158)'],
  referencesNote:
    'For more details about the security issue(s), including the impact, a CVSS score, acknowledgments, ' +
    'and other related information, refer to the CVE page(s) listed in the References section.',
};

const TEASER_MAX = 220;

function formatUsDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function getCveIds(row: ErrataRow | undefined, displayId: string): string[] {
  const combined = `${row?.detail ?? ''} ${row?.synopsis ?? ''}`;
  const found = combined.match(/CVE-\d{4}-\d+/g);
  if (found?.length) {
    return Array.from(new Set(found));
  }
  if (displayId === 'RHSA-2026:6825') {
    return ['CVE-2025-10158'];
  }
  const seed = displayId.replace(/\D/g, '').slice(-6) || '1';
  const num = (parseInt(seed, 10) % 9000) + 100;
  return [`CVE-2026-${num}`];
}

function teaserText(full: string): string {
  const t = full.trim();
  if (t.length <= TEASER_MAX) {
    return t;
  }
  return `${t.slice(0, TEASER_MAX).trim()}…`;
}

const MOCK_HOSTS = [
  { name: 'host01.example.com', env: 'Production', applicable: 'Yes', installable: 'Yes' },
  { name: 'host02.example.com', env: 'Staging', applicable: 'Yes', installable: 'No' },
  { name: 'host03.example.com', env: 'Development', applicable: 'No', installable: 'No' },
];

const MOCK_REPOS = [
  { name: 'RHEL 9 BaseOS', type: 'yum', lastSync: '2026-04-01' },
  { name: 'RHEL 9 AppStream', type: 'yum', lastSync: '2026-04-01' },
];

const MOCK_PKGS = [
  { nevra: 'rsync-3.2.3-19.el9.x86_64', arch: 'x86_64' },
  { nevra: 'rsync-3.2.3-19.el9.aarch64', arch: 'aarch64' },
];

const ErrataDetail: React.FunctionComponent = () => {
  const { errataId: rawParam } = useParams<{ errataId: string }>();
  const advisoryId = rawParam ? decodeURIComponent(rawParam) : '';

  const row = findErrataByAdvisoryId(advisoryId);
  const isRsyncFeatured = advisoryId === 'RHSA-2026:6825' || row?.errataId === 'RHSA-2026:6825';

  const displayId = row?.errataId ?? (advisoryId || 'Erratum');
  const advisoryType = row?.errataType ?? 'security';
  const isSecurity = advisoryType === 'security';
  const synopsis =
    row?.synopsis ??
    (isSecurity
      ? `${row?.severityLabel ?? 'Moderate'}: Errata advisory`
      : 'Bug fix and enhancement update');
  const severityLabel = row?.severityLabel ?? 'Moderate';

  useDocumentTitle(`PatternFly Seed | ${displayId}`);

  const [activeTabKey, setActiveTabKey] = React.useState<'hosts' | 'repositories' | 'packages'>('hosts');
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);
  const [toolbarSearch, setToolbarSearch] = React.useState('');

  React.useEffect(() => {
    setToolbarSearch('');
  }, [activeTabKey]);

  const toolbarPlaceholder =
    activeTabKey === 'hosts'
      ? 'Search hosts…'
      : activeTabKey === 'repositories'
        ? 'Search repositories…'
        : 'Search packages…';

  const primaryToolbarActionLabel =
    activeTabKey === 'hosts' ? 'Add host' : activeTabKey === 'repositories' ? 'Add repository' : 'Add package';

  const published = row ? new Date(row.publishedSort) : new Date();
  const publishDateStr = formatUsDate(published);
  const lastUpdatedStr = publishDateStr;

  const fullDescription = isRsyncFeatured
    ? `An update for rsync is now available for Red Hat Enterprise Linux. Red Hat Product Security has rated this update as having a security impact of ${severityLabel}. ${RSYNC_LONG.description}`
    : isSecurity
      ? `An update for this component is now available for Red Hat Enterprise Linux. Red Hat Product Security has rated this update as having a security impact of ${severityLabel}. ${row?.detail ?? synopsis}`
      : `An update for this component is now available for Red Hat Enterprise Linux. ${row?.detail ?? synopsis}`;

  const teaser = teaserText(fullDescription);
  const hasLongBody = fullDescription.length > TEASER_MAX;
  const descriptionParagraph =
    detailsExpanded || !hasLongBody ? fullDescription : teaser;

  const cveIds = getCveIds(row, displayId);

  const securityFixes = isRsyncFeatured
    ? RSYNC_LONG.securityFixes
    : [`${displayId}: ${row?.synopsis ?? 'security update'} (synthetic reference)`];

  const rebootRequiredFlag =
    row !== undefined
      ? row.rebootRequired
      : advisoryType === 'security' && severityLabel !== 'N/A' && severityLabel !== 'None';

  const rebootLabel = rebootRequiredFlag ? 'Reboot required' : 'Reboot not required';

  const typeRow = row ?? {
    errataId: displayId,
    errataType: advisoryType,
  };

  const tablePadded = {
    paddingLeft: spacingL,
    paddingRight: spacingL,
    boxSizing: 'border-box' as const,
    fontSize: '14px',
  };

  const filteredHosts = React.useMemo(() => {
    const q = toolbarSearch.trim().toLowerCase();
    if (!q) {
      return MOCK_HOSTS;
    }
    return MOCK_HOSTS.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.env.toLowerCase().includes(q) ||
        h.applicable.toLowerCase().includes(q) ||
        h.installable.toLowerCase().includes(q),
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

  const filteredPkgs = React.useMemo(() => {
    const q = toolbarSearch.trim().toLowerCase();
    if (!q) {
      return MOCK_PKGS;
    }
    return MOCK_PKGS.filter((p) => p.nevra.toLowerCase().includes(q) || p.arch.toLowerCase().includes(q));
  }, [toolbarSearch]);

  const tabToolbar = (
    <Toolbar
      id="errata-detail-toolbar"
      ouiaId="errata-detail-toolbar"
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
            <Button variant="primary">{primaryToolbarActionLabel}</Button>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const hostsTable = (
    <div style={tablePadded}>
      <Table
        aria-label="Affected hosts"
        variant="compact"
        borders
        isStriped
        ouiaId="errata-detail-hosts-table"
        style={{ marginBottom: 0 }}
      >
        <Thead>
          <Tr>
            <Th>Host</Th>
            <Th>Environment</Th>
            <Th>Applicable</Th>
            <Th>Installable</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredHosts.map((h) => (
            <Tr key={h.name}>
              <Td dataLabel="Host">{h.name}</Td>
              <Td dataLabel="Environment">{h.env}</Td>
              <Td dataLabel="Applicable">{h.applicable}</Td>
              <Td dataLabel="Installable">{h.installable}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );

  const reposTable = (
    <div style={tablePadded}>
      <Table
        aria-label="Repositories"
        variant="compact"
        borders
        isStriped
        ouiaId="errata-detail-repositories-table"
        style={{ marginBottom: 0 }}
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

  const packagesTable = (
    <div style={tablePadded}>
      <Table
        aria-label="Packages"
        variant="compact"
        borders
        isStriped
        ouiaId="errata-detail-packages-table"
        style={{ marginBottom: 0 }}
      >
        <Thead>
          <Tr>
            <Th>NEVRA</Th>
            <Th>Architecture</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredPkgs.map((p) => (
            <Tr key={p.nevra}>
              <Td dataLabel="NEVRA">{p.nevra}</Td>
              <Td dataLabel="Architecture">{p.arch}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );

  return (
    <PageSection
      aria-label="Errata detail"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      <div
        style={{
          paddingTop: spacingDetail,
          paddingRight: spacingL,
          paddingBottom: 0,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Breadcrumb>
          <BreadcrumbItem
            to="/content-types"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/content-types" aria-current={ariaCurrent}>
                Content Types
              </Link>
            )}
          />
          <BreadcrumbItem
            to="/errata"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/errata" aria-current={ariaCurrent}>
                Errata
              </Link>
            )}
          />
          <BreadcrumbItem isActive>{displayId}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div
        style={{
          paddingTop: spacingDetail,
          paddingRight: spacingL,
          paddingBottom: spacingDetail,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <TextContent style={bodyTextStyle}>
          <Title headingLevel="h1" size="2xl">
            {displayId}
          </Title>
          <Text component="p" style={{ marginTop: spacingSm }}>
            {synopsis}
          </Text>

          <Flex
            flexWrap={{ default: 'wrap' }}
            alignItems={{ default: 'alignItemsFlexStart' }}
            justifyContent={{ default: 'justifyContentFlexStart' }}
            style={{ marginTop: spacingDetail, gap: spacingDetail }}
          >
            <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
              <DescriptionListGroup style={dlGroupStyle}>
                <DescriptionListTerm style={termStyle}>Type</DescriptionListTerm>
                <DescriptionListDescription style={ddValueRowStyle}>
                  <ErrataTypeIconLabel row={typeRow} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
            {isSecurity && (
              <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
                <DescriptionListGroup style={dlGroupStyle}>
                  <DescriptionListTerm style={termStyle}>Severity</DescriptionListTerm>
                  <DescriptionListDescription style={ddValueRowStyle}>
                    <ErrataSeverityIconLabel severityLabel={severityLabel} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            )}
            <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
              <DescriptionListGroup style={dlGroupStyle}>
                <DescriptionListTerm style={termStyle}>Reboot</DescriptionListTerm>
                <DescriptionListDescription style={ddValueRowStyle}>
                  <ErrataRebootIconLabel rebootRequired={rebootRequiredFlag} label={rebootLabel} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
            <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
              <DescriptionListGroup style={dlGroupStyle}>
                <DescriptionListTerm style={termStyle}>Publish date</DescriptionListTerm>
                <DescriptionListDescription>{publishDateStr}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
            <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
              <DescriptionListGroup style={dlGroupStyle}>
                <DescriptionListTerm style={termStyle}>Last updated</DescriptionListTerm>
                <DescriptionListDescription>{lastUpdatedStr}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </Flex>

          <DescriptionList aria-label="CVE identifiers" style={{ marginTop: spacingDetail }}>
            <DescriptionListGroup style={dlGroupStyle}>
              <DescriptionListTerm style={termStyle}>CVEs</DescriptionListTerm>
              <DescriptionListDescription>
                <Flex flexWrap={{ default: 'wrap' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  {cveIds.map((id) => (
                    <Button
                      key={id}
                      variant="link"
                      isInline
                      component="a"
                      href={`https://access.redhat.com/security/cve/${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {id}
                    </Button>
                  ))}
                </Flex>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>

          <div style={{ marginTop: spacingDetail }} aria-label="Advisory description">
            <Text component="p" id="errata-detail-description-body" style={{ marginBottom: spacingSm }}>
              {descriptionParagraph}
            </Text>
            <div>
              <Button
                type="button"
                variant="link"
                isInline
                aria-expanded={detailsExpanded}
                aria-controls="errata-detail-description-expanded"
                onClick={() => setDetailsExpanded((prev) => !prev)}
              >
                {detailsExpanded ? 'Show less' : 'Show more'}
              </Button>
            </div>
            {detailsExpanded && (
              <div
                id="errata-detail-description-expanded"
                style={{ marginTop: spacingDetail }}
                role="region"
                aria-label="Additional advisory details"
              >
                <DescriptionList>
                  <DescriptionListGroup style={dlGroupStyle}>
                    <DescriptionListTerm style={termStyle}>Security Fix(es)</DescriptionListTerm>
                    <DescriptionListDescription>
                      <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: '1.25rem' }}>
                        {securityFixes.map((line) => (
                          <li key={line}>
                            <Text component="p">{line}</Text>
                          </li>
                        ))}
                      </ul>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
                <Text component="p" style={{ marginTop: spacingDetail }}>
                  {RSYNC_LONG.referencesNote}
                </Text>
                <Text component="p">
                  Issued {publishDateStr} · Modified {lastUpdatedStr}
                </Text>
                <div style={{ marginTop: spacingSm }}>
                  <Button
                    variant="link"
                    isInline
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                    component="a"
                    href="https://access.redhat.com/errata/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View packages and errata at access.redhat.com
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TextContent>
      </div>

      <div
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingLeft: spacingL,
          marginBottom: spacingSm,
          boxSizing: 'border-box',
        }}
      >
        <div className={css(tabStyles.tabs)} aria-label="Errata detail tabs">
          <ul className={css(tabStyles.tabsList)} role="tablist">
            <li
              className={css(tabStyles.tabsItem, activeTabKey === 'hosts' && tabStyles.modifiers.current)}
              role="presentation"
            >
              <button
                type="button"
                id={TAB_IDS.hosts}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={activeTabKey === 'hosts'}
                aria-controls={PANEL_IDS.hosts}
                tabIndex={activeTabKey === 'hosts' ? 0 : -1}
                onClick={() => setActiveTabKey('hosts')}
              >
                <span className={css(tabStyles.tabsItemText)}>Hosts</span>
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
            <li
              className={css(tabStyles.tabsItem, activeTabKey === 'packages' && tabStyles.modifiers.current)}
              role="presentation"
            >
              <button
                type="button"
                id={TAB_IDS.packages}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={activeTabKey === 'packages'}
                aria-controls={PANEL_IDS.packages}
                tabIndex={activeTabKey === 'packages' ? 0 : -1}
                onClick={() => setActiveTabKey('packages')}
              >
                <span className={css(tabStyles.tabsItemText)}>Packages</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

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

      <div
        style={{
          paddingBottom: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <section
          id={PANEL_IDS.hosts}
          role="tabpanel"
          aria-labelledby={TAB_IDS.hosts}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'hosts'}
          tabIndex={0}
        >
          {hostsTable}
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

        <section
          id={PANEL_IDS.packages}
          role="tabpanel"
          aria-labelledby={TAB_IDS.packages}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'packages'}
          tabIndex={0}
        >
          {packagesTable}
        </section>
      </div>
    </PageSection>
  );
};

export { ErrataDetail };
