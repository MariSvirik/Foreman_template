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
import { DebPackages } from '@app/DebPackages/DebPackages';
import { FilesIndex } from '@app/Files/FilesIndex';
import { FileDetail } from '@app/Files/FileDetail';
import { ModuleStreams } from '@app/ModuleStreams/ModuleStreams';
import { ModuleStreamDetail } from '@app/ModuleStreams/ModuleStreamDetail';
import { AnsibleCollections } from '@app/AnsibleCollections/AnsibleCollections';
import { AnsibleCollectionDetail } from '@app/AnsibleCollections/AnsibleCollectionDetail';
import { PythonPackages } from '@app/PythonPackages/PythonPackages';
import { Subscriptions } from '@app/Subscriptions/Subscriptions';
import { ContentCredentials } from '@app/ContentCredentials/ContentCredentials';
import { AlternateContentSources } from '@app/AlternateContentSources/AlternateContentSources';
import { SyncPlans } from '@app/SyncPlans/SyncPlans';
import { SyncPlanDetail } from '@app/SyncPlans/SyncPlanDetail';
import { SyncStatus } from '@app/SyncStatus/SyncStatus';
import { ContainerImages } from '@app/ContainerImages/ContainerImages';
import { FlatpakRemotes } from '@app/FlatpakRemotes/FlatpakRemotes';
import { Lifecycle } from '@app/Lifecycle/Lifecycle';
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
    label: 'Content',
    routes: [
      {
        element: <Subscriptions />,
        exact: true,
        label: 'Subscriptions',
        path: '/subscriptions',
        title: 'PatternFly Seed | Subscriptions',
      },
      {
        element: <Repositories />,
        exact: true,
        label: 'Products',
        path: '/repositories',
        title: 'PatternFly Seed | Products',
      },
      {
        element: <ContentCredentials />,
        exact: true,
        label: 'Content Credentials',
        path: '/content-credentials',
        title: 'PatternFly Seed | Content Credentials',
      },
      {
        element: <AlternateContentSources />,
        exact: true,
        label: 'Alternate Content Sources',
        path: '/alternate-content-sources',
        title: 'PatternFly Seed | Alternate Content Sources',
      },
      {
        element: <SyncPlans />,
        exact: true,
        label: 'Sync Plans',
        path: '/sync-plans',
        title: 'PatternFly Seed | Sync Plans',
      },
      {
        element: <SyncStatus />,
        exact: true,
        label: 'Sync Status',
        path: '/sync-status',
        title: 'PatternFly Seed | Sync Status',
      },
      {
        element: <ContainerImages />,
        exact: true,
        label: 'Container Images',
        path: '/container-images',
        title: 'PatternFly Seed | Container Images',
      },
      {
        element: <FlatpakRemotes />,
        exact: true,
        label: 'Flatpak Remotes',
        path: '/flatpak-remotes',
        title: 'PatternFly Seed | Flatpak Remotes',
      },
      {
        element: <ContentTypes />,
        exact: true,
        label: 'Content Types',
        path: '/content-types',
        title: 'PatternFly Seed | Content Types',
      },
    ],
  },
  {
    element: <SyncPlanDetail />,
    exact: true,
    path: '/sync-plans/:syncPlanId',
    title: 'PatternFly Seed | Sync Plan Detail',
  },
  {
    element: <Lifecycle />,
    exact: true,
    label: 'Lifecycle',
    path: '/lifecycle',
    title: 'PatternFly Seed | Lifecycle',
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
    element: <DebPackages />,
    exact: true,
    path: '/deb-packages',
    title: 'PatternFly Seed | Deb Packages',
  },
  {
    element: <FilesIndex />,
    exact: true,
    path: '/files',
    title: 'PatternFly Seed | Files',
  },
  {
    element: <FileDetail />,
    exact: true,
    path: '/files/:fileId',
    title: 'PatternFly Seed | File Detail',
  },
  {
    element: <ModuleStreams />,
    exact: true,
    path: '/module-streams',
    title: 'PatternFly Seed | Module Streams',
  },
  {
    element: <ModuleStreamDetail />,
    exact: true,
    path: '/module-streams/:moduleStreamId',
    title: 'PatternFly Seed | Module Stream Detail',
  },
  {
    element: <AnsibleCollections />,
    exact: true,
    path: '/ansible-collections',
    title: 'PatternFly Seed | Ansible Collections',
  },
  {
    element: <AnsibleCollectionDetail />,
    exact: true,
    path: '/ansible-collections/:collectionId',
    title: 'PatternFly Seed | Ansible Collection Detail',
  },
  {
    element: <PythonPackages />,
    exact: true,
    path: '/python-packages',
    title: 'PatternFly Seed | Python Packages',
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
    element: <AddToContainerfile />,
    exact: true,
    path: '/powerpuffgirl/add-to-containerfile',
    title: 'PatternFly Seed | Add transient packages to Containerfile',
  },
  {
    element: <PowerPuffGirl />,
    exact: true,
    path: '/powerpuffgirl',
    title: 'PatternFly Seed | PowerPuffGirl3.0-Everythingnice.com',
  },
  {
    element: <CreateHost />,
    exact: true,
    path: '/hosts/create',
    title: 'PatternFly Seed | Create Host',
  },
  {
    element: <ActivationKeys />,
    exact: true,
    path: '/activation-keys',
    title: 'PatternFly Seed | Activation Keys',
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
