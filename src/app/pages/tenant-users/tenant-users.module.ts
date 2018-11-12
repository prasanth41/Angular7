import { SharedModule } from './../../shared/shared.module';
/// <reference types="@types/googlemaps" />
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TenantUsersComponent } from './tenant-users.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
export const routes = [
     { path: '', component: TenantUsersComponent, pathMatch: 'full' }
];

@NgModule({
     imports: [
          CommonModule,
          HttpModule,
          FormsModule,
          NgxDatatableModule,
          DirectivesModule,
          ReactiveFormsModule,
          RouterModule.forChild(routes),
          InternationalPhoneNumberModule,
          TranslateModule,
          SharedModule,
          AgmCoreModule.forRoot({
               apiKey: 'AIzaSyCx_ZaqWDu6leZ7ffeIz5sG9qrN5s4KFF0',
               libraries: ["places"]
          }),
     ],
     declarations: [
          TenantUsersComponent
     ]
})
export class TenantUsersModule { }
