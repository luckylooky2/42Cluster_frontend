import { SafeDynamicImport } from '../../core/components/DynamicImports/SafeDynamicImport';
import { config } from '../../core/config';
import { RouteDescriptor } from '../../core/navigation/types';

export const getPublicDeploymentRoutes = (): RouteDescriptor[] => {
  if (!config.publicDashboardsEnabled || !config.featureToggles.publicDashboards) {
    return [];
  }

  return [
    {
      path: '/deployment',
      pageClass: 'deployment',
      routeName: 'deployment',
      component: SafeDynamicImport(() => import(/* webpackChunkName: "ListPublicDashboardPage" */ './Deployment')),
    },
  ];
};
