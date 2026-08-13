import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Level,
  LevelItem,
  MenuToggle,
  PageSection,
  Pagination,
  PaginationVariant,
  Title,
} from '@patternfly/react-core';
import { EllipsisVIcon, PencilAltIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link, useParams } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

type SyncPlanData = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  nextSync: string;
  recurringLogic: number;
  syncEnabled: boolean;
  interval: string;
};

const MOCK_SYNC_PLAN_DATA: Record<string, SyncPlanData> = {
  '1': {
    id: '1',
    name: 'Regular sync',
    description: '',
    startDate: 'November 07, 2020, 04:00 AM',
    nextSync: '',
    recurringLogic: 1,
    syncEnabled: true,
    interval: 'weekly',
  },
  '2': {
    id: '2',
    name: 'test',
    description: '',
    startDate: 'January 23, 2025, 05:00 PM',
    nextSync: 'Jul 23, 2026, 5:00 PM',
    recurringLogic: 2,
    syncEnabled: true,
    interval: 'weekly',
  },
};

type ProductRow = {
  id: string;
  name: string;
  description: string;
  syncStatus: string;
  repositories: number;
};

const MOCK_PRODUCTS: Record<string, ProductRow[]> = {
  '1': [
    { id: 'p1', name: 'CentOS7', description: '', syncStatus: 'Last synced 5 years ago', repositories: 1 },
    { id: 'p2', name: 'vagrant0bkLCentOS_7', description: '', syncStatus: 'Last synced 5 years ago', repositories: 3 },
    { id: 'p3', name: 'CentOS_8', description: '', syncStatus: 'Last synced 4 years ago', repositories: 2 },
    { id: 'p4', name: 'RHEL_8_BaseOS', description: 'Base OS packages', syncStatus: 'Last synced 3 years ago', repositories: 1 },
    { id: 'p5', name: 'Fedora_36', description: '', syncStatus: 'Last synced 2 years ago', repositories: 4 },
    { id: 'p6', name: 'Ubuntu_22', description: 'Ubuntu LTS packages', syncStatus: 'Last synced 1 year ago', repositories: 2 },
    { id: 'p7', name: 'EPEL_9', description: '', syncStatus: 'Last synced 6 months ago', repositories: 1 },
  ],
  '2': [
    { id: 'p1', name: 'TestProduct', description: 'Test product', syncStatus: 'Never synced', repositories: 1 },
  ],
};

const editIcon = (
  <PencilAltIcon
    style={{
      color: 'var(--pf-v5-global--link--Color, #06c)',
      cursor: 'pointer',
      marginLeft: '8px',
      fontSize: '14px',
    }}
  />
);

const SyncPlanDetail: React.FunctionComponent = () => {
  const { syncPlanId } = useParams<{ syncPlanId: string }>();
  const plan = MOCK_SYNC_PLAN_DATA[syncPlanId ?? ''] ?? MOCK_SYNC_PLAN_DATA['1'];
  const products = MOCK_PRODUCTS[syncPlanId ?? ''] ?? MOCK_PRODUCTS['1'];

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(5);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [kebabOpen, setKebabOpen] = React.useState(false);

  const pageCount = Math.max(1, Math.ceil(products.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = products.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const idsOnPage = slice.map((r) => r.id);
  const allOnPageSelected = idsOnPage.length > 0 && idsOnPage.every((id) => selected.has(id));

  const toggleRow = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const cellTightCheckbox: React.CSSProperties = {
    paddingRight: 'var(--pf-v5-global--spacer--xs, 8px)',
    width: '1%',
    whiteSpace: 'nowrap',
  };

  return (
    <PageSection
      aria-label="Sync plan detail"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      {/* Breadcrumb */}
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
            to="/sync-plans"
            render={({ className, ariaCurrent }) => (
              <Link className={className} to="/sync-plans" aria-current={ariaCurrent}>
                Sync plans
              </Link>
            )}
          />
          <BreadcrumbItem isActive>{plan.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Title + actions */}
      <div
        style={{
          paddingTop: spacingMd,
          paddingRight: spacingL,
          paddingBottom: spacingMd,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Level hasGutter>
          <LevelItem>
            <Title headingLevel="h1" size="2xl">
              {plan.name}
            </Title>
          </LevelItem>
          <LevelItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Button variant="primary">Run sync plan</Button>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={kebabOpen}
                  onSelect={() => setKebabOpen(false)}
                  onOpenChange={setKebabOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      variant="plain"
                      onClick={() => setKebabOpen(!kebabOpen)}
                      isExpanded={kebabOpen}
                      aria-label="Actions"
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="edit">Edit</DropdownItem>
                    <DropdownItem key="remove" isDanger>Remove</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FlexItem>
            </Flex>
          </LevelItem>
        </Level>
      </div>

      {/* Detail description list (horizontal, editable) */}
      <div
        style={{
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <DescriptionList isHorizontal isCompact>
          <DescriptionListGroup>
            <DescriptionListTerm>Description</DescriptionListTerm>
            <DescriptionListDescription>
              <span>{plan.description || '\u00A0'}</span>
              {editIcon}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Start date</DescriptionListTerm>
            <DescriptionListDescription>
              <span>{plan.startDate}</span>
              {editIcon}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Next sync</DescriptionListTerm>
            <DescriptionListDescription>
              {plan.nextSync || '\u00A0'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Recurring logic</DescriptionListTerm>
            <DescriptionListDescription>
              <Button variant="link" isInline>
                {plan.recurringLogic}
              </Button>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Sync enabled</DescriptionListTerm>
            <DescriptionListDescription>
              <span>{plan.syncEnabled ? 'Yes' : 'No'}</span>
              {editIcon}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Interval</DescriptionListTerm>
            <DescriptionListDescription>
              <span>{plan.interval}</span>
              {editIcon}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </div>

      {/* Divider */}
      <Divider component="div" />

      {/* Secondary header */}
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
            <Title headingLevel="h2" size="lg">
              Products
            </Title>
          </LevelItem>
          <LevelItem>
            <span style={{ fontSize: '14px', color: 'var(--pf-v5-global--Color--200, #6a6e73)' }}>
              {selected.size} of {products.length} selected
            </span>
          </LevelItem>
        </Level>
      </div>

      {/* Products table */}
      <div
        style={{
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Table
          aria-label="Products data"
          variant="compact"
          borders
          ouiaId="sync-plan-detail-table"
          style={{ marginBottom: 0 }}
        >
          <Thead>
            <Tr>
              <Th screenReaderText="Row select" style={cellTightCheckbox}>
                <Checkbox
                  isChecked={allOnPageSelected && idsOnPage.length > 0}
                  onChange={(_e, checked) => {
                    const next = new Set(selected);
                    if (checked) idsOnPage.forEach((id) => next.add(id));
                    else idsOnPage.forEach((id) => next.delete(id));
                    setSelected(next);
                  }}
                  aria-label="Select all rows"
                  id="sync-plan-detail-select-all"
                />
              </Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Sync status</Th>
              <Th>Repositories</Th>
            </Tr>
          </Thead>
          <Tbody>
            {slice.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel="Select row" style={cellTightCheckbox}>
                  <Checkbox
                    isChecked={selected.has(row.id)}
                    onChange={(_e, c) => toggleRow(row.id, Boolean(c))}
                    aria-label={`Select ${row.name}`}
                    id={`sync-plan-detail-select-${row.id}`}
                  />
                </Td>
                <Td dataLabel="Name">
                  <Button variant="link" isInline>
                    {row.name}
                  </Button>
                </Td>
                <Td dataLabel="Description">{row.description}</Td>
                <Td dataLabel="Sync status">{row.syncStatus}</Td>
                <Td dataLabel="Repositories">{row.repositories}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Pagination
          itemCount={products.length}
          perPage={perPage}
          page={safePage}
          onSetPage={(_e, nextPage) => setPage(nextPage)}
          onPerPageSelect={(_e, nextPerPage) => {
            setPerPage(nextPerPage);
            setPage(1);
          }}
          variant={PaginationVariant.bottom}
          isStatic
          isCompact
          ouiaId="sync-plan-detail-pagination"
          style={{
            marginTop: 0,
            paddingTop: spacingMd,
            paddingLeft: 0,
            paddingRight: 0,
          }}
        />
      </div>
    </PageSection>
  );
};

export { SyncPlanDetail };
