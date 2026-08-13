import * as React from 'react';
import {
  Button,
  DatePicker,
  Divider,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  Form,
  FormGroup,
  InputGroup,
  InputGroupItem,
  Level,
  LevelItem,
  MenuToggle,
  Modal,
  ModalVariant,
  PageSection,
  Pagination,
  PaginationVariant,
  Popover,
  SearchInput,
  TextContent,
  TextArea,
  TextInput,
  TimePicker,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { OutlinedBookmarkIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const thNowrap: React.CSSProperties = { whiteSpace: 'nowrap' };

type SyncPlanRow = {
  id: string;
  name: string;
  description: string;
  originalSyncDate: string;
  syncEnabled: boolean;
  interval: string;
  nextSync: string;
};

const MOCK_SYNC_PLANS: SyncPlanRow[] = [
  {
    id: '1',
    name: 'Regular sync',
    description: '',
    originalSyncDate: 'Nov 7, 2020, 4:00 AM',
    syncEnabled: true,
    interval: 'Weekly',
    nextSync: '',
  },
  {
    id: '2',
    name: 'test',
    description: '',
    originalSyncDate: 'Jan 23, 2025, 5:00 PM',
    syncEnabled: true,
    interval: 'Weekly',
    nextSync: 'Jul 23, 2026, 5:00 PM',
  },
];

const INTERVAL_OPTIONS = ['Hourly', 'Daily', 'Weekly', 'Custom cron'];

const SyncPlans: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [search, setSearch] = React.useState('');
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newDescription, setNewDescription] = React.useState('');
  const [newInterval, setNewInterval] = React.useState('Hourly');
  const [intervalDropdownOpen, setIntervalDropdownOpen] = React.useState(false);
  const [newCronLine, setNewCronLine] = React.useState('* * * * *');
  const [newStartDate, setNewStartDate] = React.useState('');
  const [newStartTime, setNewStartTime] = React.useState('12:00 AM');

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
        applySavedBookmarkQuery('Weekly');
        break;
      case 'saved-b2':
        applySavedBookmarkQuery('test');
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
    if (!q) return MOCK_SYNC_PLANS;
    return MOCK_SYNC_PLANS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.interval.toLowerCase().includes(q),
    );
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const itemCount = filtered.length;

  const openCreateModal = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setNewStartDate(`${yyyy}-${mm}-${dd}`);
    setNewStartTime('12:00 AM');
    setNewName('');
    setNewDescription('');
    setNewInterval('Hourly');
    setNewCronLine('* * * * *');
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleCreate = () => {
    closeCreateModal();
  };

  return (
    <PageSection
      aria-label="Sync plans"
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
                Sync plans
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </section>

      <section
        aria-label="Sync plans list"
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <Toolbar
          id="sync-plans-toolbar"
          ouiaId="sync-plans-toolbar"
          inset={{ default: 'insetNone' }}
          style={{ marginBottom: 0 }}
        >
          <ToolbarContent alignItems="center">
            <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
              <ToolbarItem style={{ flex: '0 0 auto', width: 420, maxWidth: 'min(560px, 100%)' }}>
                <InputGroup>
                  <InputGroupItem isFill>
                    <SearchInput
                      placeholder="Search"
                      value={search}
                      onChange={(_e, v) => setSearch(v)}
                      onClear={() => {
                        setSearch('');
                        setPage(1);
                      }}
                      onSearch={() => setPage(1)}
                      aria-label="Search sync plans"
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
                <Button variant="primary" onClick={openCreateModal}>
                  Create sync plan
                </Button>
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
                  ouiaId="sync-plans-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table
          aria-label="Sync plans data"
          variant="compact"
          borders
          isStriped
          ouiaId="sync-plans-table"
          style={{ marginBottom: 0, width: '100%' }}
        >
          <Thead>
            <Tr>
              <Th style={thNowrap}>Name</Th>
              <Th style={thNowrap}>Description</Th>
              <Th style={thNowrap}>Original sync date</Th>
              <Th style={thNowrap}>Sync enablement</Th>
              <Th style={thNowrap}>Interval</Th>
              <Th style={thNowrap}>Next sync</Th>
            </Tr>
          </Thead>
          <Tbody>
            {slice.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel="Name">
                  <Button variant="link" isInline onClick={() => navigate(`/sync-plans/${row.id}`)}>
                    {row.name}
                  </Button>
                </Td>
                <Td dataLabel="Description">{row.description}</Td>
                <Td dataLabel="Original sync date">{row.originalSyncDate}</Td>
                <Td dataLabel="Sync enablement">{row.syncEnabled ? 'Enabled' : 'Disabled'}</Td>
                <Td dataLabel="Interval">{row.interval}</Td>
                <Td dataLabel="Next sync">{row.nextSync}</Td>
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
          ouiaId="sync-plans-pagination-bottom"
          style={{
            marginTop: spacingMd,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingInline: 0,
          }}
        />
      </section>

      <Modal
        variant={ModalVariant.medium}
        title="Create sync plan"
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        actions={[
          <Button key="create" variant="primary" onClick={handleCreate} isDisabled={!newName.trim()}>
            Create
          </Button>,
          <Button key="cancel" variant="link" onClick={closeCreateModal}>
            Cancel
          </Button>,
        ]}
      >
        <Form isHorizontal={false}>
          <FormGroup label="Name" isRequired fieldId="sync-plan-name">
            <TextInput
              isRequired
              id="sync-plan-name"
              value={newName}
              onChange={(_e, v) => setNewName(v)}
            />
          </FormGroup>
          <FormGroup
            label={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Start
                <Popover
                  bodyContent="The time the sync should happen in your current time zone."
                  showClose
                >
                  <Button
                    variant="plain"
                    aria-label="More info about start time"
                    style={{ padding: 0, fontSize: 'inherit', verticalAlign: 'middle' }}
                    icon={<OutlinedQuestionCircleIcon />}
                  />
                </Popover>
              </span>
            }
            fieldId="sync-plan-start"
          >
            <InputGroup>
              <InputGroupItem>
                <DatePicker
                  value={newStartDate}
                  onChange={(_e, value) => setNewStartDate(value)}
                  aria-label="Start date"
                  appendTo={() => document.body}
                />
              </InputGroupItem>
              <InputGroupItem>
                <TimePicker
                  time={newStartTime}
                  onChange={(_e, time) => setNewStartTime(time)}
                  aria-label="Start time"
                  menuAppendTo={() => document.body}
                />
              </InputGroupItem>
            </InputGroup>
          </FormGroup>
          <FormGroup label="Repeats" fieldId="sync-plan-interval">
            <Dropdown
              isOpen={intervalDropdownOpen}
              onOpenChange={setIntervalDropdownOpen}
              onSelect={(_e, value) => {
                const val = String(value);
                setNewInterval(val);
                if (val === 'Custom cron') {
                  setNewCronLine('* * * * *');
                }
                setIntervalDropdownOpen(false);
              }}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIntervalDropdownOpen(!intervalDropdownOpen)}
                  isExpanded={intervalDropdownOpen}
                  isFullWidth
                >
                  {newInterval}
                </MenuToggle>
              )}
              popperProps={{ appendTo: () => document.body }}
            >
              <DropdownList>
                {INTERVAL_OPTIONS.map((opt) => (
                  <DropdownItem key={opt} value={opt}>
                    {opt}
                  </DropdownItem>
                ))}
              </DropdownList>
            </Dropdown>
          </FormGroup>
          {newInterval === 'Custom cron' && (
            <FormGroup
              label={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Cron line (extended)
                  <Popover
                    bodyContent={
                      <div>
                        <p>Cron line format &apos;1 2 3 4 5&apos;, where:</p>
                        <ol style={{ paddingLeft: '1.25rem', margin: '8px 0' }}>
                          <li>is minute (range: 0-59)</li>
                          <li>is hour (range: 0-23)</li>
                          <li>is day of month (range: 1-31)</li>
                          <li>is month (range: 1-12)</li>
                          <li>is day of week (range: 0-6)</li>
                        </ol>
                        <p style={{ marginTop: '8px' }}>
                          The cron line supports extended cron line syntax. For details please refer to
                          the <a href="https://en.wikipedia.org/wiki/Cron" target="_blank" rel="noopener noreferrer">documentation</a>.
                        </p>
                      </div>
                    }
                    showClose
                  >
                    <Button
                      variant="plain"
                      aria-label="More info about cron line"
                      style={{ padding: 0, fontSize: 'inherit', verticalAlign: 'middle' }}
                      icon={<OutlinedQuestionCircleIcon />}
                    />
                  </Popover>
                </span>
              }
              isRequired
              fieldId="sync-plan-cron-line"
            >
              <TextInput
                isRequired
                id="sync-plan-cron-line"
                value={newCronLine}
                onChange={(_e, v) => setNewCronLine(v)}
              />
            </FormGroup>
          )}
          <FormGroup label="Description" fieldId="sync-plan-description">
            <TextArea
              id="sync-plan-description"
              value={newDescription}
              onChange={(_e, v) => setNewDescription(v)}
              resizeOrientation="vertical"
              rows={2}
              aria-label="Description"
            />
          </FormGroup>
        </Form>
      </Modal>
    </PageSection>
  );
};

export { SyncPlans };
