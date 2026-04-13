import * as React from 'react';
import { PageSection, Text, Title } from '@patternfly/react-core';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

/**
 * Task list placeholder so /tasks breadcrumb targets resolve (detail is /tasks/:taskId).
 */
const TasksIndex: React.FunctionComponent = () => {
  useDocumentTitle('PatternFly Seed | Tasks');

  return (
    <PageSection>
      <Title headingLevel="h1" size="2xl">
        Tasks
      </Title>
      <Text component="p">Select a task from your environment or open a task from recent activity.</Text>
    </PageSection>
  );
};

export { TasksIndex };
