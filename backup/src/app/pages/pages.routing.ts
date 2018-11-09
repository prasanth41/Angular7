import { SettingsModule } from './settings/settings.module';
import { TenantUsersModule } from './tenant-users/tenant-users.module';
import { TenantsModule } from './tenants/tenants.module';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from '../services/auth-guard/auth-guard';
import { PagesComponent } from './pages.component';
import { BlankComponent } from './blank/blank.component';
import { SearchComponent } from './search/search.component';
export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard], data: { breadcrumb: 'Dashboard', expectedRoles: ['Master', 'Tenant'] } },
      { path: 'tenants', loadChildren: 'app/pages/tenants/tenants.module#TenantsModule', canActivate: [AuthGuard], data: { breadcrumb: 'Tenants', expectedRoles: ['Master'] } },
      { path: 'users', loadChildren: 'app/pages/users/users.module#UsersModule', canActivate: [AuthGuard], data: { breadcrumb: 'Users', expectedRoles: ['Master'] } },
      { path: 'maps', loadChildren: 'app/pages/maps/maps.module#MapsModule', data: { breadcrumb: 'Maps' } },
      { path: 'charts', loadChildren: 'app/pages/charting/charting.module#ChartingModule', data: { breadcrumb: 'Charts' } },
      { path: 'ui', loadChildren: 'app/pages/ui/ui.module#UiModule', data: { breadcrumb: 'UI' } },
      { path: 'tools', loadChildren: 'app/pages/tools/tools.module#ToolsModule', data: { breadcrumb: 'Tools' } },
      { path: 'mail', loadChildren: 'app/pages/mail/mail.module#MailModule', data: { breadcrumb: 'Mail' } },
      { path: 'calendar', loadChildren: 'app/pages/calendar/calendar.module#CalendarModule', data: { breadcrumb: 'Calendar' } },
      { path: 'form-elements', loadChildren: 'app/pages/form-elements/form-elements.module#FormElementsModule', data: { breadcrumb: 'Form Elements' } },
      { path: 'tables', loadChildren: 'app/pages/tables/tables.module#TablesModule', data: { breadcrumb: 'Tables' } },
      { path: 'editors', loadChildren: 'app/pages/editors/editors.module#EditorsModule', data: { breadcrumb: 'Editors' } },
      { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' } },
      { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' } },
      { path: 'tenant-users', loadChildren: 'app/pages/tenant-users/tenant-users.module#TenantUsersModule', canActivate: [AuthGuard], data: { breadcrumb: 'Users', expectedRoles: ['Tenant'] } },
      { path: 'settings', loadChildren: 'app/pages/settings/settings.module#SettingsModule', canActivate: [AuthGuard], data: { breadcrumb: 'Settings', expectedRoles: ['Master', 'Tenant'] } },
      { path: 'alerts', loadChildren: 'app/pages/alerts/alerts.module#AlertsModule', canActivate: [AuthGuard], data: { breadcrumb: 'Alerts', expectedRoles: ['Tenant'] } },
      { path: 'zones', loadChildren: 'app/pages/zones/zones.module#ZonesModule', canActivate: [AuthGuard], data: { breadcrumb: 'Zones', expectedRoles: ['Tenant'] } },
      { path: 'analytics', loadChildren: 'app/pages/analytics/analytics.module#AnalyticsModule', canActivate: [AuthGuard], data: { breadcrumb: 'Analytics', expectedRoles: ['Master', 'Tenant'] } },

    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
