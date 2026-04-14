import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import '@app/app.css';

const routerBasename =
  typeof __ROUTER_BASENAME__ === 'string' && __ROUTER_BASENAME__.length > 0
    ? __ROUTER_BASENAME__
    : undefined;

const App: React.FunctionComponent = () => (
  <Router basename={routerBasename}>
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  </Router>
);

export default App;
