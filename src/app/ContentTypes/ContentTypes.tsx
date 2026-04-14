import * as React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  PageSection,
  Stack,
  Text,
  Title,
} from '@patternfly/react-core';
import {
  AnsibleTowerIcon,
  BlueprintIcon,
  BuilderImageIcon,
  CubesIcon,
  DatabaseIcon,
  FileAltIcon,
  SecurityIcon,
  ThIcon,
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';
/** 8px — space between page title and intro paragraph */
const titleToDescriptionGap = 'var(--pf-v5-global--spacer--sm, var(--pf-global--spacer--sm, 8px))';
/** 16px — section spacing (title block bottom / cards block top) */
const sectionSpacing = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';

type ContentTypeItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  /** When set, the card navigates to this route */
  to?: string;
};

const CONTENT_TYPES: ContentTypeItem[] = [
  {
    id: 'container-image-tags',
    title: 'Container image tags',
    description: 'Container images and tags for podman, OpenShift, and Kubernetes.',
    icon: BuilderImageIcon,
  },
  {
    id: 'files',
    title: 'Files',
    description: 'Arbitrary files distributed to managed hosts.',
    icon: FileAltIcon,
  },
  {
    id: 'module-streams',
    title: 'Module streams',
    description: 'Application streams and module metadata.',
    icon: BlueprintIcon,
  },
  {
    id: 'deb',
    title: 'Deb packages',
    description: 'Debian packages synced from upstream repositories.',
    icon: DatabaseIcon,
  },
  {
    id: 'errata',
    title: 'Errata',
    description: 'Security, bug fix, and enhancement advisories.',
    icon: SecurityIcon,
    to: '/errata',
  },
  {
    id: 'packages',
    title: 'Packages',
    description: 'RPM packages for Red Hat and compatible systems.',
    icon: CubesIcon,
    to: '/packages',
  },
  {
    id: 'ansible-collections',
    title: 'Ansible collections',
    description: 'Automation content for Ansible and Ansible Tower.',
    icon: AnsibleTowerIcon,
  },
  {
    id: 'other',
    title: 'Other content types',
    description: 'Additional or custom repository content types.',
    icon: ThIcon,
  },
];

const ContentTypes: React.FunctionComponent = () => {
  useDocumentTitle('PatternFly Seed | Content Types');

  return (
    <PageSection
      aria-label="Content Types"
      style={{ backgroundColor: background100 }}
    >
      <Stack hasGutter={false}>
        <section
          aria-label="Title and description"
          style={{ paddingBottom: sectionSpacing, boxSizing: 'border-box' }}
        >
          <Title headingLevel="h1" size="2xl">
            Content Types
          </Title>
          <Text component="p" style={{ marginTop: titleToDescriptionGap }}>
            Define and control the specific formats of software, metadata, and automation assets that
            populate your library and drive your deployment workflows.
          </Text>
        </section>

        <section aria-label="Content type cards" style={{ paddingTop: sectionSpacing, boxSizing: 'border-box' }}>
        <Grid hasGutter>
          {CONTENT_TYPES.map(({ id, title, description, icon: Icon, to }) => {
            const card = (
              <Card isFlat isFullHeight>
                <CardTitle>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--pf-v5-global--spacer--sm, var(--pf-global--spacer--sm, 0.5rem))',
                    }}
                  >
                    <Icon />
                    <span>{title}</span>
                  </div>
                </CardTitle>
                <CardBody>
                  <Text>{description}</Text>
                </CardBody>
              </Card>
            );
            return (
              <GridItem key={id} span={12} sm={6} lg={4} xl={3}>
                {to ? (
                  <Link
                    to={to}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                  >
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </GridItem>
            );
          })}
        </Grid>
        </section>
      </Stack>
    </PageSection>
  );
};

export { ContentTypes };
