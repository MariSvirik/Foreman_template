import * as React from 'react';
import {
  PageSection,
  TextContent,
  Title,
} from '@patternfly/react-core';

const SyncStatus: React.FunctionComponent = () => (
  <PageSection>
    <TextContent>
      <Title headingLevel="h1" size="2xl">Sync Status</Title>
    </TextContent>
  </PageSection>
);

export { SyncStatus };
