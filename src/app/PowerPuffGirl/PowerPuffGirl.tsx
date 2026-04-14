import * as React from 'react';
import {
    Alert,
    AlertActionCloseButton,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownList,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    MenuToggle,
    PageSection,
    SearchInput,
    Select,
    SelectList,
    SelectOption,
    Spinner,
    Tab,
    TabContent,
    TabContentBody,
    TabTitleText,
    Tabs,
    Text,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
} from '@patternfly/react-core';
import { BulkSelect, BulkSelectValue } from '@patternfly/react-component-groups/dist/esm/BulkSelect';
import { css } from '@patternfly/react-styles';
import tabStyles from '@patternfly/react-styles/css/components/Tabs/tabs.mjs';
import tabContentStyles from '@patternfly/react-styles/css/components/TabContent/tab-content.mjs';
import {
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@patternfly/react-table';
import {
    ArrowUpIcon,
    CheckCircleIcon,
    CheckIcon,
    EllipsisVIcon,
    SearchIcon,
} from '@patternfly/react-icons';
import { Link, useNavigate } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const PRIMARY_TAB_IDS = {
    overview: 'powerpuff-primary-tab-overview',
    details: 'powerpuff-primary-tab-details',
    content: 'powerpuff-primary-tab-content',
    parameters: 'powerpuff-primary-tab-parameters',
    traces: 'powerpuff-primary-tab-traces',
    lightspeed: 'powerpuff-primary-tab-lightspeed',
} as const;

const PRIMARY_PANEL_IDS = {
    overview: 'powerpuff-primary-panel-overview',
    details: 'powerpuff-primary-panel-details',
    content: 'powerpuff-primary-panel-content',
    parameters: 'powerpuff-primary-panel-parameters',
    traces: 'powerpuff-primary-panel-traces',
    lightspeed: 'powerpuff-primary-panel-lightspeed',
} as const;

type PrimaryTabKey = keyof typeof PRIMARY_TAB_IDS;

// Mock data for packages
const mockPackages = [
    {
        id: 1,
        name: 'httpd',
        persistence: 'Persistent',
        status: 'Upgradable',
        installedVersion: '2.4.53-1.el9',
        upgradableTo: '2.4.55-2.el9'
    },
    {
        id: 2,
        name: 'nginx',
        persistence: 'Transient',
        status: 'Up-to-date',
        installedVersion: '1.20.1-13.el9',
        upgradableTo: '-'
    },
    {
        id: 3,
        name: 'kernel',
        persistence: 'Persistent',
        status: 'Upgradable',
        installedVersion: '5.14.0-162.6.1.el9',
        upgradableTo: '5.14.0-284.25.1.el9'
    },
    {
        id: 4,
        name: 'systemd',
        persistence: 'Persistent',
        status: 'Up-to-date',
        installedVersion: '250-12.el9',
        upgradableTo: '-'
    },
    {
        id: 5,
        name: 'openssh',
        persistence: 'Transient',
        status: 'Upgradable',
        installedVersion: '8.7p1-24.el9',
        upgradableTo: '8.7p1-29.el9'
    }
];

const PowerPuffGirl: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const [primaryActiveTabKey, setPrimaryActiveTabKey] = React.useState<PrimaryTabKey>('content');
    const [secondaryActiveTabKey, setSecondaryActiveTabKey] = React.useState<string>('packages');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState('All status');
    const [searchValue, setSearchValue] = React.useState('');
    const [selectedPackages, setSelectedPackages] = React.useState<Set<number>>(new Set());
    const [isActionsKebabOpen, setIsActionsKebabOpen] = React.useState(false);
    const [openRowKebabs, setOpenRowKebabs] = React.useState<Set<number>>(new Set());
    const [isLoading] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(true);

    const handleSecondaryTabClick = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
        setSecondaryActiveTabKey(tabIndex as string);
    };

    const onStatusDropdownToggle = () => {
        setIsStatusDropdownOpen(!isStatusDropdownOpen);
    };

    const onStatusSelect = (event: React.MouseEvent | undefined, value: string | number | undefined) => {
        setStatusFilter(value as string);
        setIsStatusDropdownOpen(false);
    };

    const handleRowSelect = (pkgId: number, isSelected: boolean) => {
        const newSelected = new Set(selectedPackages);
        if (isSelected) {
            newSelected.add(pkgId);
        } else {
            newSelected.delete(pkgId);
        }
        setSelectedPackages(newSelected);
    };

    const getStatusIcon = (status: string) => {
        if (status === 'Upgradable') {
            return <ArrowUpIcon style={{ color: 'var(--pf-global--primary-color--100)' }} />;
        } else {
            return <CheckIcon style={{ color: 'var(--pf-global--success-color--100)' }} />;
        }
    };

    const getPersistenceText = (persistence: string) => {
        return persistence;
    };

    const toggleRowKebab = (pkgId: number) => {
        const newOpenKebabs = new Set(openRowKebabs);
        if (newOpenKebabs.has(pkgId)) {
            newOpenKebabs.delete(pkgId);
        } else {
            newOpenKebabs.add(pkgId);
        }
        setOpenRowKebabs(newOpenKebabs);
    };

    const filteredPackages = mockPackages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchValue.toLowerCase());
        const matchesStatus = statusFilter === 'All status' || pkg.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const idsOnPage = filteredPackages.map((p) => p.id);
    const allOnPageSelected = idsOnPage.length > 0 && idsOnPage.every((id) => selectedPackages.has(id));
    const partiallySelectedPage =
        idsOnPage.some((id) => selectedPackages.has(id)) && !allOnPageSelected;

    const clearSelection = () => setSelectedPackages(new Set());
    const selectAllFiltered = () => setSelectedPackages(new Set(filteredPackages.map((p) => p.id)));
    const selectPageIds = () => {
        setSelectedPackages((prev) => {
            const next = new Set(prev);
            idsOnPage.forEach((id) => next.add(id));
            return next;
        });
    };
    const clearPageSelection = () => {
        setSelectedPackages((prev) => {
            const next = new Set(prev);
            idsOnPage.forEach((id) => next.delete(id));
            return next;
        });
    };

    const onBulkSelect = (value: (typeof BulkSelectValue)[keyof typeof BulkSelectValue]) => {
        switch (value) {
            case BulkSelectValue.none:
                clearSelection();
                break;
            case BulkSelectValue.all:
                selectAllFiltered();
                break;
            case BulkSelectValue.page:
                selectPageIds();
                break;
            case BulkSelectValue.nonePage:
                clearPageSelection();
                break;
            default:
                break;
        }
    };

    const handleAddToContainerfile = (packageIds?: Set<number>) => {
        const idsToUse = packageIds || selectedPackages;
        // Filter to only transient packages
        const transientIds = Array.from(idsToUse).filter(id => {
            const pkg = mockPackages.find(p => p.id === id);
            return pkg?.persistence === 'Transient';
        });

        if (transientIds.length > 0) {
            navigate('/powerpuffgirl/add-to-containerfile', {
                state: { selectedPackages: new Set(transientIds) }
            });
        }
    };

    // Check if any selected packages are upgradable
    const hasUpgradableSelected = Array.from(selectedPackages).some(id => {
        const pkg = mockPackages.find(p => p.id === id);
        return pkg?.status === 'Upgradable';
    });

    const packagesContent = (
        <div>
            {showAlert && (
                <Alert
                    variant="info"
                    title="Package changes not persistent"
                    isInline
                    actionClose={<AlertActionCloseButton onClose={() => setShowAlert(false)} />}
                    style={{ marginTop: '24px', marginBottom: '16px' }}
                >
                    To permanently install packages on this host, they must be added to the Containerfile. Otherwise, any changes will be lost on the next reboot.
                </Alert>
            )}
            <div style={{ marginTop: showAlert ? '0' : '24px' }}>
                <Toolbar
                    id="packages-toolbar"
                    ouiaId="powerpuff-packages-toolbar"
                    inset={{ default: 'insetNone' }}
                    style={{ marginBottom: 0 }}
                >
                    <ToolbarContent alignItems="center">
                        <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
                            <ToolbarItem>
                                <BulkSelect
                                    ouiaId="powerpuff-packages-bulk-select"
                                    isDataPaginated
                                    canSelectAll
                                    pageCount={idsOnPage.length}
                                    selectedCount={selectedPackages.size}
                                    totalCount={filteredPackages.length}
                                    pageSelected={allOnPageSelected}
                                    pagePartiallySelected={partiallySelectedPage}
                                    onSelect={onBulkSelect}
                                    popperProps={{ appendTo: () => document.body }}
                                    menuToggleCheckboxProps={{
                                        id: 'powerpuff-packages-bulk-checkbox',
                                        'aria-label':
                                            selectedPackages.size > 0
                                                ? `Select rows, ${selectedPackages.size} of ${filteredPackages.length} selected`
                                                : 'Select rows',
                                    }}
                                />
                            </ToolbarItem>
                        </ToolbarGroup>

                        <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
                            <ToolbarItem style={{ flex: '0 0 auto', width: 320, maxWidth: 'min(480px, 100%)' }}>
                                <SearchInput
                                    name="search-packages"
                                    id="search-packages"
                                    aria-label="Search packages"
                                    placeholder="Search packages by name or status…"
                                    value={searchValue}
                                    onChange={(_event, value) => setSearchValue(value)}
                                    onClear={() => setSearchValue('')}
                                />
                            </ToolbarItem>
                        </ToolbarGroup>

                        <ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <ToolbarItem>
                                <Select
                                    isOpen={isStatusDropdownOpen}
                                    selected={statusFilter}
                                    onSelect={onStatusSelect}
                                    onOpenChange={setIsStatusDropdownOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={onStatusDropdownToggle}
                                            isExpanded={isStatusDropdownOpen}
                                        >
                                            {statusFilter}
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        <SelectOption value="All status">All status</SelectOption>
                                        <SelectOption value="Upgradable">Upgradable</SelectOption>
                                        <SelectOption value="Up-to-date">Up-to-date</SelectOption>
                                    </SelectList>
                                </Select>
                            </ToolbarItem>
                            <ToolbarItem>
                                <Button
                                    variant="primary"
                                    isDisabled={!hasUpgradableSelected}
                                    onClick={() => console.log('Upgrade selected packages')}
                                >
                                    Upgrade
                                </Button>
                            </ToolbarItem>
                            <ToolbarItem>
                                <Dropdown
                                    isOpen={isActionsKebabOpen}
                                    onOpenChange={setIsActionsKebabOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            variant="plain"
                                            onClick={() => setIsActionsKebabOpen(!isActionsKebabOpen)}
                                            isExpanded={isActionsKebabOpen}
                                            aria-label="Actions menu"
                                        >
                                            <EllipsisVIcon />
                                        </MenuToggle>
                                    )}
                                    popperProps={{ appendTo: () => document.body }}
                                >
                                    <DropdownList>
                                        <DropdownItem
                                            key="add-to-containerfile"
                                            isDisabled={!Array.from(selectedPackages).some((id) => {
                                                const pkg = mockPackages.find((p) => p.id === id);
                                                return pkg?.persistence === 'Transient';
                                            })}
                                            description="Transient packages only"
                                            onClick={() => handleAddToContainerfile()}
                                        >
                                            Add to Containerfile
                                        </DropdownItem>
                                        <DropdownItem key="refresh">Refresh packages</DropdownItem>
                                        <DropdownItem key="export">Export package list</DropdownItem>
                                        <DropdownItem key="settings">Package settings</DropdownItem>
                                    </DropdownList>
                                </Dropdown>
                            </ToolbarItem>
                        </ToolbarGroup>
                    </ToolbarContent>
                </Toolbar>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--pf-global--spacer--xl)' }}>
                        <Spinner size="lg" />
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <EmptyState>
                        <EmptyStateIcon icon={SearchIcon} />
                        <Title headingLevel="h4" size="lg">
                            No packages found
                        </Title>
                        <EmptyStateBody>
                            No packages match your search criteria. Try adjusting your filters or search terms.
                        </EmptyStateBody>
                    </EmptyState>
                ) : (
                    <Table variant="compact" isStriped>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Package name</Th>
                                <Th>Persistence</Th>
                                <Th>Status</Th>
                                <Th>Installed version</Th>
                                <Th>Upgradable to</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredPackages.map((pkg) => (
                                <Tr key={pkg.id}>
                                    <Td>
                                        <Checkbox
                                            isChecked={selectedPackages.has(pkg.id)}
                                            onChange={(event, checked) => handleRowSelect(pkg.id, checked)}
                                            aria-label={`Select package ${pkg.name}`}
                                            id={`select-pkg-${pkg.id}`}
                                            name={`select-pkg-${pkg.id}`}
                                        />
                                    </Td>
                                    <Td dataLabel="Package name">{pkg.name}</Td>
                                    <Td dataLabel="Persistence">{getPersistenceText(pkg.persistence)}</Td>
                                    <Td dataLabel="Status">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {getStatusIcon(pkg.status)}
                                            {pkg.status}
                                        </div>
                                    </Td>
                                    <Td dataLabel="Installed version">{pkg.installedVersion}</Td>
                                    <Td dataLabel="Upgradable to">{pkg.upgradableTo}</Td>
                                    <Td>
                                        <Dropdown
                                            isOpen={openRowKebabs.has(pkg.id)}
                                            onOpenChange={(isOpen) => {
                                                if (!isOpen) {
                                                    const newOpenKebabs = new Set(openRowKebabs);
                                                    newOpenKebabs.delete(pkg.id);
                                                    setOpenRowKebabs(newOpenKebabs);
                                                }
                                            }}
                                            toggle={(toggleRef) => (
                                                <MenuToggle
                                                    ref={toggleRef}
                                                    variant="plain"
                                                    onClick={() => toggleRowKebab(pkg.id)}
                                                    isExpanded={openRowKebabs.has(pkg.id)}
                                                    aria-label={`Actions for ${pkg.name}`}
                                                >
                                                    <EllipsisVIcon />
                                                </MenuToggle>
                                            )}
                                            popperProps={{ appendTo: () => document.body }}
                                        >
                                            <DropdownList>
                                                <DropdownItem
                                                    key="add-to-containerfile"
                                                    isDisabled={pkg.persistence !== 'Transient'}
                                                    description="Transient packages only"
                                                    onClick={() => handleAddToContainerfile(new Set([pkg.id]))}
                                                >
                                                    Add to Containerfile
                                                </DropdownItem>
                                                <DropdownItem key="remove" isDanger>
                                                    Remove
                                                </DropdownItem>
                                            </DropdownList>
                                        </Dropdown>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </div>
        </div>
    );

    const secondaryTabsContent = (
        <Tabs
            activeKey={secondaryActiveTabKey}
            onSelect={handleSecondaryTabClick}
            aria-label="Content secondary tabs"
            role="region"
            isSecondary
        >
            <Tab
                eventKey="packages"
                title={<TabTitleText>Packages</TabTitleText>}
                aria-label="Packages tab"
            >
                <TabContent eventKey="packages" id="packages-content">
                    <TabContentBody>
                        {packagesContent}
                    </TabContentBody>
                </TabContent>
            </Tab>
            <Tab
                eventKey="errata"
                title={<TabTitleText>Errata</TabTitleText>}
                aria-label="Errata tab"
            >
                <TabContent eventKey="errata" id="errata-content">
                    <TabContentBody>
                        <Card>
                            <CardBody>
                                <EmptyState>
                                    <EmptyStateIcon icon={SearchIcon} />
                                    <Title headingLevel="h4" size="lg">
                                        No errata available
                                    </Title>
                                    <EmptyStateBody>
                                        There are no security advisories or bug fixes available for this system.
                                    </EmptyStateBody>
                                </EmptyState>
                            </CardBody>
                        </Card>
                    </TabContentBody>
                </TabContent>
            </Tab>
            <Tab
                eventKey="modules"
                title={<TabTitleText>Module streams</TabTitleText>}
                aria-label="Module streams tab"
            >
                <TabContent eventKey="modules" id="modules-content">
                    <TabContentBody>
                        <Card>
                            <CardBody>
                                <EmptyState>
                                    <EmptyStateIcon icon={SearchIcon} />
                                    <Title headingLevel="h4" size="lg">
                                        No module streams
                                    </Title>
                                    <EmptyStateBody>
                                        No module streams are currently available for this system.
                                    </EmptyStateBody>
                                </EmptyState>
                            </CardBody>
                        </Card>
                    </TabContentBody>
                </TabContent>
            </Tab>
            <Tab
                eventKey="repositories"
                title={<TabTitleText>Repositories</TabTitleText>}
                aria-label="Repositories tab"
            >
                <TabContent eventKey="repositories" id="repositories-content">
                    <TabContentBody>
                        <Card>
                            <CardBody>
                                <EmptyState>
                                    <EmptyStateIcon icon={SearchIcon} />
                                    <Title headingLevel="h4" size="lg">
                                        No repositories configured
                                    </Title>
                                    <EmptyStateBody>
                                        No package repositories are configured for this system.
                                    </EmptyStateBody>
                                </EmptyState>
                            </CardBody>
                        </Card>
                    </TabContentBody>
                </TabContent>
            </Tab>
        </Tabs>
    );

    const primaryTabButton = (tabKey: PrimaryTabKey, label: string) => (
        <li
            className={css(
                tabStyles.tabsItem,
                primaryActiveTabKey === tabKey && tabStyles.modifiers.current,
            )}
            role="presentation"
            key={tabKey}
        >
            <button
                type="button"
                id={PRIMARY_TAB_IDS[tabKey]}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={primaryActiveTabKey === tabKey}
                aria-controls={PRIMARY_PANEL_IDS[tabKey]}
                tabIndex={primaryActiveTabKey === tabKey ? 0 : -1}
                onClick={() => setPrimaryActiveTabKey(tabKey)}
            >
                <span className={css(tabStyles.tabsItemText)}>{label}</span>
            </button>
        </li>
    );

    return (
        <PageSection padding={{ default: 'noPadding' }} style={{ backgroundColor: background100 }}>
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
                        to="/"
                        render={({ className, ariaCurrent }) => (
                            <Link className={className} to="/" aria-current={ariaCurrent}>
                                Dashboard
                            </Link>
                        )}
                    />
                    <BreadcrumbItem isActive>PowerPuffGirl3.0-Everythingnice.com</BreadcrumbItem>
                </Breadcrumb>
            </div>

            <div
                style={{
                    paddingTop: spacingMd,
                    paddingRight: spacingL,
                    paddingBottom: spacingMd,
                    paddingLeft: spacingL,
                    boxSizing: 'border-box',
                }}
            >
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            columnGap: 'var(--pf-v5-global--spacer--sm, 8px)',
                        }}
                    >
                        <Title headingLevel="h1" size="2xl" style={{ margin: 0 }}>
                            PowerPuffGirl3.0-Everythingnice.com
                        </Title>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1,
                            }}
                            aria-hidden
                        >
                            <CheckCircleIcon style={{ color: 'var(--pf-global--success-color--100)' }} />
                        </span>
                    </div>
                    <Text component="p" style={{ color: 'var(--pf-global--Color--200)', marginTop: spacingMd }}>
                        Created 3 months ago by Mr.MojoJ (updated 1 minute ago)
                    </Text>
                </div>
            </div>

            <div
                style={{
                    paddingTop: 0,
                    paddingRight: spacingL,
                    paddingLeft: spacingL,
                    boxSizing: 'border-box',
                }}
            >
                <div className={css(tabStyles.tabs)} aria-label="Host primary tabs">
                    <ul className={css(tabStyles.tabsList)} role="tablist">
                        {primaryTabButton('overview', 'Overview')}
                        {primaryTabButton('details', 'Details')}
                        {primaryTabButton('content', 'Content')}
                        {primaryTabButton('parameters', 'Parameters')}
                        {primaryTabButton('traces', 'Traces')}
                        {primaryTabButton('lightspeed', 'Red Hat Lightspeed')}
                    </ul>
                </div>
            </div>

            <div style={{ paddingBottom: spacingL, boxSizing: 'border-box' }}>
                <section
                    id={PRIMARY_PANEL_IDS.overview}
                    role="tabpanel"
                    aria-labelledby={PRIMARY_TAB_IDS.overview}
                    className={css(tabContentStyles.tabContent)}
                    style={{ paddingLeft: spacingL, paddingRight: spacingL }}
                    hidden={primaryActiveTabKey !== 'overview'}
                    tabIndex={0}
                >
                    <Card>
                        <CardBody>
                            <Title headingLevel="h3" size="md">
                                System Overview
                            </Title>
                            <Text>System overview information would be displayed here.</Text>
                        </CardBody>
                    </Card>
                </section>

                <section
                    id={PRIMARY_PANEL_IDS.details}
                    role="tabpanel"
                    aria-labelledby={PRIMARY_TAB_IDS.details}
                    className={css(tabContentStyles.tabContent)}
                    style={{ paddingLeft: spacingL, paddingRight: spacingL }}
                    hidden={primaryActiveTabKey !== 'details'}
                    tabIndex={0}
                >
                    <Card>
                        <CardBody>
                            <Title headingLevel="h3" size="md">
                                System Details
                            </Title>
                            <Text>Detailed system information would be displayed here.</Text>
                        </CardBody>
                    </Card>
                </section>

                <section
                    id={PRIMARY_PANEL_IDS.content}
                    role="tabpanel"
                    aria-labelledby={PRIMARY_TAB_IDS.content}
                    className={css(tabContentStyles.tabContent)}
                    style={{ padding: 0 }}
                    hidden={primaryActiveTabKey !== 'content'}
                    tabIndex={0}
                >
                    {secondaryTabsContent}
                </section>

                <section
                    id={PRIMARY_PANEL_IDS.parameters}
                    role="tabpanel"
                    aria-labelledby={PRIMARY_TAB_IDS.parameters}
                    className={css(tabContentStyles.tabContent)}
                    style={{ paddingLeft: spacingL, paddingRight: spacingL }}
                    hidden={primaryActiveTabKey !== 'parameters'}
                    tabIndex={0}
                >
                    <Card>
                        <CardBody>
                            <Title headingLevel="h3" size="md">
                                System Parameters
                            </Title>
                            <Text>System parameters and configuration would be displayed here.</Text>
                        </CardBody>
                    </Card>
                </section>

                <section
                    id={PRIMARY_PANEL_IDS.traces}
                    role="tabpanel"
                    aria-labelledby={PRIMARY_TAB_IDS.traces}
                    className={css(tabContentStyles.tabContent)}
                    style={{ paddingLeft: spacingL, paddingRight: spacingL }}
                    hidden={primaryActiveTabKey !== 'traces'}
                    tabIndex={0}
                >
                    <Card>
                        <CardBody>
                            <Title headingLevel="h3" size="md">
                                System Traces
                            </Title>
                            <Text>System trace information would be displayed here.</Text>
                        </CardBody>
                    </Card>
                </section>

                <section
                    id={PRIMARY_PANEL_IDS.lightspeed}
                    role="tabpanel"
                    aria-labelledby={PRIMARY_TAB_IDS.lightspeed}
                    className={css(tabContentStyles.tabContent)}
                    style={{ paddingLeft: spacingL, paddingRight: spacingL }}
                    hidden={primaryActiveTabKey !== 'lightspeed'}
                    tabIndex={0}
                >
                    <Card>
                        <CardBody>
                            <Title headingLevel="h3" size="md">
                                Red Hat Lightspeed
                            </Title>
                            <Text>Red Hat Lightspeed integration and features would be displayed here.</Text>
                        </CardBody>
                    </Card>
                </section>
            </div>
        </PageSection>
    );
};

export { PowerPuffGirl }; 