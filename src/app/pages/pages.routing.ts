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
      { path: 'tenant-users', loadChildren: 'app/pages/tenant-users/tenant-users.module#TenantUsersModule', canActivate: [AuthGuard], data: { breadcrumb: 'Users', expectedRoles: ['Tenant'] } },
      { path: 'settings', loadChildren: 'app/pages/settings/settings.module#SettingsModule', canActivate: [AuthGuard], data: { breadcrumb: 'Settings', expectedRoles: ['Master', 'Tenant'] } },
      { path: 'alerts', loadChildren: 'app/pages/alerts/alerts.module#AlertsModule', canActivate: [AuthGuard], data: { breadcrumb: 'Alerts', expectedRoles: ['Tenant'] } },
      { path: 'zones', loadChildren: 'app/pages/zones/zones.module#ZonesModule', canActivate: [AuthGuard], data: { breadcrumb: 'Zones', expectedRoles: ['Tenant'] } },
      { path: 'analytics', loadChildren: 'app/pages/analytics/analytics.module#AnalyticsModule', canActivate: [AuthGuard], data: { breadcrumb: 'Analytics', expectedRoles: ['Master', 'Tenant'] } },
      { path: 'business-rules', loadChildren: 'app/pages/business-rules/business-rules.module#BusinessRulesModule', canActivate: [AuthGuard], data: { breadcrumb: 'Business Rules', expectedRoles: ['Tenant'] } },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
