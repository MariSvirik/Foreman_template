import * as React from 'react';
import {
  ActionGroup,
  Button,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  PageSection,
  Progress,
  Spinner,
  Stack,
  Text,
  Title,
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
  ArrowDownIcon,
  ArrowUpIcon,
  DatabaseIcon,
  DollarSignIcon,
  ExclamationTriangleIcon,
  ExternalLinkAltIcon,
  PercentageIcon,
  SearchIcon,
  SecurityIcon,
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const mockMetrics = {
  totalUsers: 1247,
  activeUsers: 892,
  revenue: 24580,
  conversion: 3.2,
};

const mockErrataMetrics = {
  securityAdvisories: 42,
  applicableToHosts: 156,
  repositoriesInSync: 8,
  repositoriesTotal: 10,
};

const mockRecentActivity = [
  { id: 1, user: 'John Smith', action: 'Logged in', time: '2 minutes ago', status: 'success' },
  { id: 2, user: 'Jane Doe', action: 'Updated profile', time: '1 hour ago', status: 'info' },
  { id: 3, user: 'Bob Johnson', action: 'Failed login attempt', time: '2 hours ago', status: 'danger' },
  { id: 4, user: 'Alice Brown', action: 'Created new project', time: '3 hours ago', status: 'success' },
  { id: 5, user: 'Charlie Wilson', action: 'Uploaded document', time: '5 hours ago', status: 'info' }
];

const mockTableData = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', status: 'Active', lastLogin: '2 hours ago', role: 'Admin' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', status: 'Active', lastLogin: '1 day ago', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', status: 'Inactive', lastLogin: '1 week ago', role: 'User' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', status: 'Pending', lastLogin: 'Never', role: 'User' }
];

/** 4px between icons and adjacent text (dashboard-wide, including trend arrows) */
const dashboardIconTextRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  columnGap: '4px',
};

const dashboardIconWrapStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  lineHeight: 1,
};

/** 8px between severity label and message in alerts card */
const dashboardAlertsLabelRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
};

const sentenceCase = (value: string): string => {
  if (!value) {
    return value;
  }
  const s = value.trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const Dashboard: React.FunctionComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, _setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const getStatusLabel = (status: string) => {
    let color: 'green' | 'red' | 'orange' | 'blue' = 'blue';
    if (status === 'Active' || status === 'success' || status === 'Valid') color = 'green';
    else if (status === 'Inactive' || status === 'danger' || status === 'Invalid') color = 'red';
    else if (status === 'Pending' || status === 'info') color = 'blue';

    return <Label color={color}>{sentenceCase(status)}</Label>;
  };

  const getTrendIcon = (isPositive: boolean) => {
    return isPositive ? (
      <ArrowUpIcon style={{ color: 'var(--pf-global--success-color--100)' }} />
    ) : (
      <ArrowDownIcon style={{ color: 'var(--pf-global--danger-color--100)' }} />
    );
  };

  if (isLoading) {
    return (
      <PageSection>
        <Spinner size="xl" />
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Stack hasGutter>
        {/* Header Section */}
        <div>
          <Title headingLevel="h1" size="lg">PatternFly v5 dashboard</Title>
          <Text>
            Welcome to your PatternFly v5 dashboard! This demonstrates various PatternFly v5 components and patterns.
          </Text>
        </div>

        {/* Metrics Cards Grid */}
        <Grid hasGutter>
          <GridItem span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardTitle>
                <div style={dashboardIconTextRowStyle}>
                  <span style={dashboardIconWrapStyle} aria-hidden>
                    <SecurityIcon />
                  </span>
                  <span>Security errata</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <Title headingLevel="h2" size="2xl">{mockErrataMetrics.securityAdvisories.toLocaleString()}</Title>
                  <div style={dashboardIconTextRowStyle}>
                    <span style={dashboardIconWrapStyle} aria-hidden>
                      {getTrendIcon(true)}
                    </span>
                    <Text component="small">New advisories this month</Text>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardTitle>
                <div style={dashboardIconTextRowStyle}>
                  <span style={dashboardIconWrapStyle} aria-hidden>
                    <ExclamationTriangleIcon />
                  </span>
                  <span>Applicable errata</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <Title headingLevel="h2" size="2xl">{mockErrataMetrics.applicableToHosts.toLocaleString()}</Title>
                  <div style={dashboardIconTextRowStyle}>
                    <span style={dashboardIconWrapStyle} aria-hidden>
                      {getTrendIcon(false)}
                    </span>
                    <Text component="small">Across registered content hosts</Text>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardTitle>
                <div style={dashboardIconTextRowStyle}>
                  <span style={dashboardIconWrapStyle} aria-hidden>
                    <DollarSignIcon />
                  </span>
                  <span>Revenue</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <Title headingLevel="h2" size="2xl">${mockMetrics.revenue.toLocaleString()}</Title>
                  <div style={dashboardIconTextRowStyle}>
                    <span style={dashboardIconWrapStyle} aria-hidden>
                      {getTrendIcon(false)}
                    </span>
                    <Text component="small">-3% from last month</Text>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardTitle>
                <div style={dashboardIconTextRowStyle}>
                  <span style={dashboardIconWrapStyle} aria-hidden>
                    <PercentageIcon />
                  </span>
                  <span>Conversion rate</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <Title headingLevel="h2" size="2xl">{mockMetrics.conversion}%</Title>
                  <Progress value={mockMetrics.conversion * 10} min={0} max={100} measureLocation="outside" />
                  <Text component="small">Target: 5.0%</Text>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Users Table */}
        <Card>
          <CardTitle>User management</CardTitle>
          <CardBody>
            <Table variant="compact" isStriped>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Last login</Th>
                  <Th>Role</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockTableData.map((user) => (
                  <Tr key={user.id}>
                    <Td dataLabel="Name">{user.name}</Td>
                    <Td dataLabel="Email">{user.email}</Td>
                    <Td dataLabel="Status">{getStatusLabel(user.status)}</Td>
                    <Td dataLabel="Last login">{user.lastLogin}</Td>
                    <Td dataLabel="Role">{user.role}</Td>
                    <Td dataLabel="Actions">
                      <ActionGroup>
                        <Button variant="link" size="sm">
                          Edit
                        </Button>
                        <Button variant="link" size="sm" isDanger>
                          Delete
                        </Button>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Content Section */}
        <Grid hasGutter>
          <GridItem span={12} lg={8}>
            <Card isFullHeight>
              <CardTitle>Recent activity</CardTitle>
              <CardBody>
                <List>
                  {mockRecentActivity.map((activity) => (
                    <ListItem key={activity.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                          <Text component="p">
                            <strong>{activity.user}</strong> {activity.action}
                          </Text>
                          <Text component="small" style={{ color: 'var(--pf-global--Color--200)' }}>
                            {activity.time}
                          </Text>
                        </div>
                        {getStatusLabel(activity.status)}
                      </div>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} lg={4}>
            <Stack hasGutter>
              <Card isFullHeight>
                <CardTitle>System information</CardTitle>
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Version</DescriptionListTerm>
                      <DescriptionListDescription>PatternFly 5.4.14</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Environment</DescriptionListTerm>
                      <DescriptionListDescription>Development</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Uptime</DescriptionListTerm>
                      <DescriptionListDescription>15 days, 3 hours</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Last backup</DescriptionListTerm>
                      <DescriptionListDescription>2 hours ago</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>

              <Card>
                <CardTitle>Quick actions</CardTitle>
                <CardBody>
                  <Stack hasGutter>
                    <ActionGroup>
                      <Button variant="primary">
                        Generate report
                      </Button>
                      <Button variant="secondary">
                        Export data
                      </Button>
                    </ActionGroup>
                    <ActionGroup>
                      <Button
                        variant="link"
                        component="a"
                        href="https://patternfly.org/v5"
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                        style={{ columnGap: '4px' }}
                      >
                        PatternFly v5 documentation
                      </Button>
                      <Button variant="link" isDanger>
                        Reset dashboard
                      </Button>
                    </ActionGroup>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </GridItem>
        </Grid>

        {/* Status Cards */}
        <Grid hasGutter>
          <GridItem span={12} md={4}>
            <Card>
              <CardTitle>
                <div style={dashboardIconTextRowStyle}>
                  <span style={dashboardIconWrapStyle} aria-hidden>
                    <SecurityIcon />
                  </span>
                  <span>Errata repositories</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Synced</Text>
                    <Label color="green">
                      {mockErrataMetrics.repositoriesInSync} of {mockErrataMetrics.repositoriesTotal}
                    </Label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Last metadata sync</Text>
                    <Text component="small">12 minutes ago</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Security advisories (repo)</Text>
                    <Label color="blue">{mockErrataMetrics.securityAdvisories}</Label>
                  </div>
                  <Button variant="link" size="sm" isInline onClick={() => navigate('/errata')}>
                    View errata list
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={4}>
            <Card>
              <CardTitle>
                <div style={dashboardIconTextRowStyle}>
                  <span style={dashboardIconWrapStyle} aria-hidden>
                    <DatabaseIcon />
                  </span>
                  <span>Performance metrics</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <div>
                    <Text component="p">CPU usage</Text>
                    <Progress value={45} measureLocation="outside" />
                  </div>
                  <div>
                    <Text component="p">Memory usage</Text>
                    <Progress value={67} measureLocation="outside" />
                  </div>
                  <div>
                    <Text component="p">Disk usage</Text>
                    <Progress value={32} measureLocation="outside" />
                  </div>
                  <div>
                    <Text component="p">Network I/O</Text>
                    <Progress value={23} measureLocation="outside" />
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={4}>
            <Card>
              <CardTitle>
                <div style={dashboardIconTextRowStyle}>
                  <span style={dashboardIconWrapStyle} aria-hidden>
                    <ExclamationTriangleIcon />
                  </span>
                  <span>Alerts and notifications</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <div style={dashboardAlertsLabelRowStyle}>
                    <Label color="red">Critical</Label>
                    <Text component="small">High memory usage detected</Text>
                  </div>
                  <div style={dashboardAlertsLabelRowStyle}>
                    <Label color="orange">Warning</Label>
                    <Text component="small">SSL certificate expires in 30 days</Text>
                  </div>
                  <div style={dashboardAlertsLabelRowStyle}>
                    <Label color="blue">Info</Label>
                    <Text component="small">System maintenance scheduled</Text>
                  </div>
                  <Button variant="link" size="sm">
                    View all alerts
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Divider />

        {/* PatternFly Features Showcase */}
        <Card>
          <CardTitle>PatternFly v5 features demonstrated</CardTitle>
          <CardBody>
            <Grid hasGutter>
              <GridItem span={12} md={6}>
                <Stack hasGutter>
                  <Title headingLevel="h3" size="md">Layout components</Title>
                  <List>
                    <ListItem>
                      <Text>
                        <strong>Grid system:</strong> Responsive 12-column grid with gutters
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Stack:</strong> Vertical layout with consistent spacing
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Cards:</strong> Flexible content containers with titles and bodies
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Page section:</strong> Proper page structure with semantic layout
                      </Text>
                    </ListItem>
                  </List>
                </Stack>
              </GridItem>
              <GridItem span={12} md={6}>
                <Stack hasGutter>
                  <Title headingLevel="h3" size="md">Data and interactive components</Title>
                  <List>
                    <ListItem>
                      <Text>
                        <strong>Tables:</strong> Responsive tables with proper column headers and actions
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Buttons:</strong> Primary, secondary, and link variants with icons
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Labels:</strong> Color-coded status indicators with semantic meaning
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Progress:</strong> Visual progress indicators with measurements
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Text and typography:</strong> Semantic text components with proper hierarchy
                      </Text>
                    </ListItem>
                  </List>
                </Stack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Empty State Example (conditionally shown) */}
        {mockRecentActivity.length === 0 && (
          <Card>
            <CardBody>
              <EmptyState>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h4" size="lg">
                  No recent activity
                </Title>
                <EmptyStateBody>
                  No recent activity to display. Try adjusting your time range or check back later.
                </EmptyStateBody>
                <Button variant="primary">Refresh data</Button>
              </EmptyState>
            </CardBody>
          </Card>
        )}
      </Stack>
    </PageSection>
  );
};

export { Dashboard };
