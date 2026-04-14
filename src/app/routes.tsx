import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Repositories } from '@app/Repositories/Repositories';
import { PowerPuffGirl } from '@app/PowerPuffGirl/PowerPuffGirl';
import { AddToContainerfile } from '@app/AddToContainerfile/AddToContainerfile';
import { ActivationKeys } from '@app/ActivationKeys/ActivationKeys';
import { ProductDetail } from '@app/ProductDetail/ProductDetail';
import { CreateHost } from '@app/CreateHost/CreateHost';
import { TaskDetail } from '@app/TaskDetail/TaskDetail';
import { TasksIndex } from '@app/Tasks/TasksIndex';
import { TemplateIndex } from '@app/TemplateIndex/TemplateIndex';
import { TemplateDetail } from '@app/TemplateDetail/TemplateDetail';
import { ContentTypes } from '@app/ContentTypes/ContentTypes';
import { ErrataIndex } from '@app/Errata/ErrataIndex';
import { ErrataDetail } from '@app/Errata/ErrataDetail';
import { PackageDetail } from '@app/Packages/PackageDetail';
import { Packages } from '@app/Packages/Packages';
import { NotFound } from '@app/NotFound/NotFound';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  element: React.ReactElement;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

// Products route has been removed - do not add it back
const routes: AppRouteConfig[] = [
  {
    element: <Dashboard />,
    exact: true,
    label: 'Dashboard',
    path: '/',
    title: 'PatternFly Seed | Main Dashboard',
  },
  {
    element: <Repositories />,
    exact: true,
    label: 'Products',
    path: '/repositories',
    title: 'PatternFly Seed | Products',
  }, // Products route
  {
    element: <ContentTypes />,
    exact: true,
    label: 'Content Types',
    path: '/content-types',
    title: 'PatternFly Seed | Content Types',
  },
  {
    element: <ErrataIndex />,
    exact: true,
    path: '/errata',
    title: 'PatternFly Seed | Errata',
  },
  {
    element: <ErrataDetail />,
    exact: true,
    path: '/errata/:errataId',
    title: 'PatternFly Seed | Errata detail',
  },
  {
    element: <Packages />,
    exact: true,
    path: '/packages',
    title: 'PatternFly Seed | Packages',
  },
  {
    element: <PackageDetail />,
    exact: true,
    path: '/packages/:packageId',
    title: 'PatternFly Seed | Package detail',
  },
  {
    element: <ProductDetail />,
    exact: true,
    path: '/products/:productName',
    title: 'PatternFly Seed | Product Detail',
  },
  {
    element: <TasksIndex />,
    exact: true,
    path: '/tasks',
    title: 'PatternFly Seed | Tasks',
  },
  {
    element: <TaskDetail />,
    exact: true,
    path: '/tasks/:taskId',
    title: 'PatternFly Seed | Task Detail',
  },
  {
    element: <TemplateIndex />,
    exact: true,
    label: 'Template',
    path: '/template',
    title: 'PatternFly Seed | Template',
  },
  {
    element: <TemplateDetail />,
    exact: true,
    path: '/template/:templateId',
    title: 'PatternFly Seed | Template detail',
  },
  {
    element: <PowerPuffGirl />,
    exact: true,
    label: 'PowerPuffGirl3.0-Everythingnice.com',
    path: '/powerpuffgirl',
    title: 'PatternFly Seed | PowerPuffGirl3.0-Everythingnice.com',
  },
  {
    element: <AddToContainerfile />,
    exact: true,
    path: '/powerpuffgirl/add-to-containerfile',
    title: 'PatternFly Seed | Add transient packages to Containerfile',
  },
  {
    label: 'Other projects',
    routes: [
      {
        element: <CreateHost />,
        exact: true,
        label: 'Create Host',
        path: '/hosts/create',
        title: 'PatternFly Seed | Create Host',
      },
      {
        element: <ActivationKeys />,
        exact: true,
        label: 'Activation Keys',
        path: '/activation-keys',
        title: 'PatternFly Seed | Activation Keys',
      },
    ],
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
