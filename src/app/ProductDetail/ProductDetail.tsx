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
    Dropdown,
    DropdownItem,
    DropdownList,
    ExpandableSection,
    Flex,
    FlexItem,
    Grid,
    GridItem,
    MenuToggle,
    MenuToggleCheckbox,
    PageSection,
    Pagination,
    PaginationVariant,
    SearchInput,
    Stack,
    Tab,
    TabContent,
    TabContentBody,
    TabTitleText,
    Tabs,
    Text,
    TextArea,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
    Tooltip,
} from '@patternfly/react-core';
import {
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@patternfly/react-table';
import {
    EllipsisVIcon,
    PencilAltIcon,
    RedoIcon,
    SyncIcon,
} from '@patternfly/react-icons';
import { Link, useParams } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

// Mock data for product
const mockProductData = {
    description: '',
    gpgKey: '',
    sslCaCert: '',
    sslClientCert: '',
    sslClientKey: '',
    syncPlan: '',
    syncInterval: 'Synced manually, no interval set.',
    lastSync: '2 years ago (February 02, 2024 at 06:06 PM Local Time)',
    nextSync: 'Synced manually, no interval set.',
    syncState: 'No sync information available.',
};

// Mock repositories data
const mockRepositories = [
    {
        id: 1,
        name: 'RHEL 9.4 bootc',
        type: 'docker',
        syncStatus: 'Completed almost 2 years ago',
        content: [
            '2 Container Image Manifests',
            '1 Container Image Manifest Lists',
            '1 Container Image Tags',
        ],
    },
    {
        id: 2,
        name: 'RHEL 9.4 compose',
        type: 'yum',
        syncStatus: 'Completed almost 2 years ago',
        content: [
            '1174 Packages',
            '0 Errata',
            '34 Package Groups',
            '0 Module Streams',
        ],
    },
];

const ProductDetail: React.FunctionComponent = () => {
    const { productName } = useParams<{ productName: string }>();
    const [activeTabKey, setActiveTabKey] = React.useState<string>('repositories');
    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = React.useState(false);
    const [selectedRepositories, setSelectedRepositories] = React.useState<Set<number>>(new Set());
    const [isBulkSelectOpen, setIsBulkSelectOpen] = React.useState(false);
    const [isRepositoriesKebabOpen, setIsRepositoriesKebabOpen] = React.useState(false);
    const [isHeaderKebabOpen, setIsHeaderKebabOpen] = React.useState(false);
    const [description, setDescription] = React.useState(mockProductData.description);
    const [isEditingDescription, setIsEditingDescription] = React.useState(false);
    const [isSslExpanded, setIsSslExpanded] = React.useState(false);
    const [isSyncExpanded, setIsSyncExpanded] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(20);

    useDocumentTitle(`PatternFly Seed | ${productName || 'Product'}`);

    const handleTabClick = (_event: React.MouseEvent, tabIndex: string) => {
        setActiveTabKey(tabIndex);
    };

    // Filter repositories based on search
    const filteredRepositories = mockRepositories.filter(repo =>
        repo.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Pagination calculations
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedRepositories = filteredRepositories.slice(startIndex, endIndex);

    const handleRowSelect = (repoId: number, isSelected: boolean) => {
        const newSelected = new Set(selectedRepositories);
        if (isSelected) {
            newSelected.add(repoId);
        } else {
            newSelected.delete(repoId);
        }
        setSelectedRepositories(newSelected);
    };

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedRepositories(new Set(filteredRepositories.map(repo => repo.id)));
        } else {
            setSelectedRepositories(new Set());
        }
    };

    const handleSelectPage = () => {
        setSelectedRepositories(new Set(paginatedRepositories.map(repo => repo.id)));
    };

    const isAllSelected = selectedRepositories.size === filteredRepositories.length && filteredRepositories.length > 0;
    const isPartiallySelected = selectedRepositories.size > 0 && selectedRepositories.size < filteredRepositories.length;
    const menuToggleCheckmark: boolean | null = isAllSelected ? true : isPartiallySelected ? null : false;

    const handleDescriptionEdit = () => {
        setIsEditingDescription(true);
    };

    const handleDescriptionSave = () => {
        setIsEditingDescription(false);
    };

    const handleDescriptionCancel = () => {
        setDescription(mockProductData.description);
        setIsEditingDescription(false);
    };

    const repositoriesTabContent = (
        <>
            <Toolbar>
                <ToolbarContent>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Dropdown
                                isOpen={isBulkSelectOpen}
                                onSelect={() => setIsBulkSelectOpen(false)}
                                onOpenChange={setIsBulkSelectOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsBulkSelectOpen(!isBulkSelectOpen)}
                                        isExpanded={isBulkSelectOpen}
                                        splitButtonOptions={{
                                            items: [
                                                <MenuToggleCheckbox
                                                    id="bulk-select-checkbox-repos"
                                                    key="bulk-select-checkbox-repos"
                                                    aria-label="Select all"
                                                    isChecked={menuToggleCheckmark}
                                                    onChange={(checked) => handleSelectAll(checked)}
                                                />
                                            ]
                                        }}
                                        aria-label="Bulk select"
                                    />
                                )}
                                popperProps={{ appendTo: () => document.body }}
                            >
                                <DropdownList>
                                    <DropdownItem key="select-none" onClick={() => {
                                        handleSelectAll(false);
                                        setIsBulkSelectOpen(false);
                                    }}>
                                        Select none ({filteredRepositories.length} items)
                                    </DropdownItem>
                                    <DropdownItem key="select-page" onClick={() => {
                                        handleSelectPage();
                                        setIsBulkSelectOpen(false);
                                    }}>
                                        Select page ({paginatedRepositories.length} items)
                                    </DropdownItem>
                                    <DropdownItem key="select-all" onClick={() => {
                                        handleSelectAll(true);
                                        setIsBulkSelectOpen(false);
                                    }}>
                                        Select all ({filteredRepositories.length} items)
                                    </DropdownItem>
                                </DropdownList>
                            </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                            <SearchInput
                                placeholder="Search..."
                                value={searchValue}
                                onChange={(event, value) => {
                                    setSearchValue(value);
                                    setPage(1);
                                }}
                                onClear={() => setSearchValue('')}
                            />
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Button variant="primary">Add repository</Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button variant="secondary" icon={<SyncIcon />}>Sync</Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Dropdown
                                isOpen={isRepositoriesKebabOpen}
                                onOpenChange={setIsRepositoriesKebabOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        variant="plain"
                                        onClick={() => setIsRepositoriesKebabOpen(!isRepositoriesKebabOpen)}
                                        isExpanded={isRepositoriesKebabOpen}
                                        aria-label="Actions"
                                    >
                                        <EllipsisVIcon />
                                    </MenuToggle>
                                )}
                                popperProps={{ appendTo: () => document.body }}
                            >
                            <DropdownList>
                                <DropdownItem key="repo-discovery">Repo discovery</DropdownItem>
                                <DropdownItem key="remove">Remove repositories</DropdownItem>
                                <DropdownItem key="reclaim">Reclaim space</DropdownItem>
                            </DropdownList>
                            </Dropdown>
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>
            <div style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
                <Pagination
                    itemCount={filteredRepositories.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_event, pageNumber) => setPage(pageNumber)}
                    onPerPageSelect={(_event, perPageOption) => {
                        setPerPage(perPageOption);
                        setPage(1);
                    }}
                    variant={PaginationVariant.top}
                    isCompact
                />
            </div>
            <Table>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th>Sync status</Th>
                        <Th>Content</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {paginatedRepositories.map((repo) => (
                        <Tr key={repo.id}>
                            <Td>
                                <Checkbox
                                    isChecked={selectedRepositories.has(repo.id)}
                                    onChange={(event, checked) => handleRowSelect(repo.id, checked)}
                                    aria-label={`Select repository ${repo.name}`}
                                    id={`select-repo-${repo.id}`}
                                    name={`select-repo-${repo.id}`}
                                />
                            </Td>
                            <Td dataLabel="Name">
                                <Button variant="link" isInline>
                                    {repo.name}
                                </Button>
                            </Td>
                            <Td dataLabel="Type">{repo.type}</Td>
                            <Td dataLabel="Sync status">{repo.syncStatus}</Td>
                            <Td dataLabel="Content">
                                <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                    {repo.content.map((item, index) => (
                                        <FlexItem key={index}>
                                            <Button variant="link" isInline>
                                                {item}
                                            </Button>
                                        </FlexItem>
                                    ))}
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <div style={{ marginTop: 'var(--pf-global--spacer--md)' }}>
                <Pagination
                    itemCount={filteredRepositories.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_event, pageNumber) => setPage(pageNumber)}
                    onPerPageSelect={(_event, perPageOption) => {
                        setPerPage(perPageOption);
                        setPage(1);
                    }}
                    variant={PaginationVariant.bottom}
                    isCompact
                />
            </div>
        </>
    );

    return (
        <PageSection style={{ backgroundColor: 'white' }}>
            <Stack hasGutter>
                {/* Breadcrumbs */}
                <Breadcrumb>
                    <BreadcrumbItem
                        to="/repositories"
                        render={({ className, ariaCurrent }) => (
                            <Link className={className} to="/repositories" aria-current={ariaCurrent}>
                                Products
                            </Link>
                        )}
                    />
                    <BreadcrumbItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <FlexItem>{productName || 'Product'}</FlexItem>
                            <FlexItem>
                                <Button variant="plain" aria-label="Refresh" style={{ padding: 0 }}>
                                    <RedoIcon />
                                </Button>
                            </FlexItem>
                        </Flex>
                    </BreadcrumbItem>
                </Breadcrumb>

                {/* Header */}
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <Title headingLevel="h1" size="lg">{productName || 'Product'}</Title>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        <Button variant="secondary">Edit</Button>
                        <Dropdown
                            isOpen={isHeaderKebabOpen}
                            onOpenChange={setIsHeaderKebabOpen}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    variant="plain"
                                    onClick={() => setIsHeaderKebabOpen(!isHeaderKebabOpen)}
                                    isExpanded={isHeaderKebabOpen}
                                    aria-label="Actions"
                                >
                                    <EllipsisVIcon />
                                </MenuToggle>
                            )}
                            popperProps={{ appendTo: () => document.body }}
                        >
                            <DropdownList>
                                <DropdownItem key="delete" isDanger>Delete</DropdownItem>
                            </DropdownList>
                        </Dropdown>
                    </Flex>
                </Flex>

                {/* Two Column Layout */}
                <Grid hasGutter>
                    {/* Left Column */}
                    <GridItem span={12} md={6}>
                        <Stack hasGutter>
                            {/* Description */}
                            <div>
                                {isEditingDescription ? (
                                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                        <FlexItem>
                                            <TextArea
                                                value={description}
                                                onChange={(value) => setDescription(value)}
                                                aria-label="Description"
                                                rows={3}
                                            />
                                        </FlexItem>
                                        <FlexItem>
                                            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                                                <FlexItem>
                                                    <Button variant="primary" onClick={handleDescriptionSave}>Save</Button>
                                                </FlexItem>
                                                <FlexItem>
                                                    <Button variant="secondary" onClick={handleDescriptionCancel}>Cancel</Button>
                                                </FlexItem>
                                            </Flex>
                                        </FlexItem>
                                    </Flex>
                                ) : (
                                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                        <FlexItem>
                                            <Text>{description || 'No description'}</Text>
                                        </FlexItem>
                                        <FlexItem>
                                            <Button variant="plain" aria-label="Edit description" onClick={handleDescriptionEdit} style={{ padding: 0 }}>
                                                <PencilAltIcon />
                                            </Button>
                                        </FlexItem>
                                    </Flex>
                                )}
                            </div>

                            {/* GPG Key Section */}
                            <div>
                                <DescriptionList>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>
                                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                                <FlexItem>GPG key</FlexItem>
                                                <FlexItem>
                                                    <Button variant="plain" aria-label="Edit GPG key" style={{ padding: 0 }}>
                                                        <PencilAltIcon />
                                                    </Button>
                                                </FlexItem>
                                            </Flex>
                                        </DescriptionListTerm>
                                        <DescriptionListDescription>{mockProductData.gpgKey || ''}</DescriptionListDescription>
                                    </DescriptionListGroup>
                                </DescriptionList>
                            </div>
                        </Stack>
                    </GridItem>

                    {/* Right Column - SSL and Sync Status */}
                    <GridItem span={12} md={6}>
                        <Stack hasGutter>
                            {/* SSL Section - Expandable */}
                            <div>
                                <ExpandableSection
                                    toggleText="SSL"
                                    onToggle={() => setIsSslExpanded(!isSslExpanded)}
                                    isExpanded={isSslExpanded}
                                >
                                    <DescriptionList>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>
                                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                                    <FlexItem>SSL CA cert</FlexItem>
                                                    <FlexItem>
                                                        <Button variant="plain" aria-label="Edit SSL CA Cert" style={{ padding: 0 }}>
                                                            <PencilAltIcon />
                                                        </Button>
                                                    </FlexItem>
                                                </Flex>
                                            </DescriptionListTerm>
                                            <DescriptionListDescription>{mockProductData.sslCaCert || ''}</DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>
                                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                                    <FlexItem>SSL client cert</FlexItem>
                                                    <FlexItem>
                                                        <Button variant="plain" aria-label="Edit SSL Client Cert" style={{ padding: 0 }}>
                                                            <PencilAltIcon />
                                                        </Button>
                                                    </FlexItem>
                                                </Flex>
                                            </DescriptionListTerm>
                                            <DescriptionListDescription>{mockProductData.sslClientCert || ''}</DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>
                                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                                    <FlexItem>SSL client key</FlexItem>
                                                    <FlexItem>
                                                        <Button variant="plain" aria-label="Edit SSL Client Key" style={{ padding: 0 }}>
                                                            <PencilAltIcon />
                                                        </Button>
                                                    </FlexItem>
                                                </Flex>
                                            </DescriptionListTerm>
                                            <DescriptionListDescription>{mockProductData.sslClientKey || ''}</DescriptionListDescription>
                                        </DescriptionListGroup>
                                    </DescriptionList>
                                </ExpandableSection>
                            </div>

                            {/* Sync Status Section */}
                            <div>
                                <ExpandableSection
                                    toggleText="Sync status"
                                    onToggle={() => setIsSyncExpanded(!isSyncExpanded)}
                                    isExpanded={isSyncExpanded}
                                >
                                    <DescriptionList>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>
                                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                                    <FlexItem>Sync plan</FlexItem>
                                                    <FlexItem>
                                                        <Button variant="plain" aria-label="Edit sync plan" style={{ padding: 0 }}>
                                                            <PencilAltIcon />
                                                        </Button>
                                                    </FlexItem>
                                                </Flex>
                                            </DescriptionListTerm>
                                            <DescriptionListDescription>{mockProductData.syncPlan || ''}</DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Sync interval</DescriptionListTerm>
                                            <DescriptionListDescription>{mockProductData.syncInterval}</DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Last sync</DescriptionListTerm>
                                            <DescriptionListDescription>
                                                <Tooltip content="February 02, 2024 at 06:06 PM Local Time">
                                                    <span style={{ textDecoration: 'underline', cursor: 'help' }}>2 years ago</span>
                                                </Tooltip>
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Next sync</DescriptionListTerm>
                                            <DescriptionListDescription>{mockProductData.nextSync}</DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Sync state</DescriptionListTerm>
                                            <DescriptionListDescription>{mockProductData.syncState}</DescriptionListDescription>
                                        </DescriptionListGroup>
                                    </DescriptionList>
                                </ExpandableSection>
                            </div>
                        </Stack>
                    </GridItem>
                </Grid>

                {/* Tabs */}
                <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
                    <Tab eventKey="repositories" title={<TabTitleText>Repositories</TabTitleText>} aria-label="Repositories tab">
                        <TabContent eventKey="repositories" id="repositories-content">
                            <TabContentBody>
                                {repositoriesTabContent}
                            </TabContentBody>
                        </TabContent>
                    </Tab>
                    <Tab eventKey="tasks" title={<TabTitleText>Tasks</TabTitleText>} aria-label="Tasks tab">
                        <TabContent eventKey="tasks" id="tasks-content">
                            <TabContentBody>
                                <Text>Tasks content would be displayed here.</Text>
                            </TabContentBody>
                        </TabContent>
                    </Tab>
                </Tabs>
            </Stack>
        </PageSection>
    );
};

export { ProductDetail };
