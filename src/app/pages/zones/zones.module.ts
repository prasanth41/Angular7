import { SharedModule } from './../../shared/shared.module';
import { ZoneInfoComponent } from './zones-info/zone-info.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { TranslateModule } from "@ngx-translate/core";
import { DirectivesModule } from '../../theme/directives/directives.module';
import { ZonesComponent } from './zones.component';
import { AuthGuard } from '../../app.module';
export const routes = [
     { path: '', component: ZonesComponent, pathMatch: 'full' },
     { path: 'zone-info', component: ZoneInfoComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Zone Info', expectedRoles: ['Tenant'] } },
];
@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          NgxDatatableModule,
          DirectivesModule,
          ReactiveFormsModule,
          TabsModule.forRoot(),
          RouterModule.forChild(routes),
          TranslateModule,
          SharedModule
     ],
     declarations: [
          ZonesComponent,
          ZoneInfoComponent,
     ]
})
export class ZonesModule { }
