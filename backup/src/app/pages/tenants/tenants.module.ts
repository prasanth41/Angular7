/// <reference types="@types/googlemaps" />
// map: google.maps.Map;
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { TenantsComponent } from './tenants.component';
import { AddEditTenantComponent } from './add-edit-tenant/add-edit-tenant.component';
import { DeleteTenantComponent } from './delete-tenant/delete-tenant.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
// import {  } from '@types/googlemaps';
import { ModalModule } from 'ngx-bootstrap';
export const routes = [
  { path: '', component: TenantsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    AgmCoreModule,
    ModalModule.forRoot(),
    InternationalPhoneNumberModule
  ],
  declarations: [
    TenantsComponent,
    AddEditTenantComponent,
    DeleteTenantComponent
  ]
})
export class TenantsModule { }
