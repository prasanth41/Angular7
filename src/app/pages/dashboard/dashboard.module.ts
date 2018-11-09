import { HttpModule } from '@angular/http';
import { AuthGuard } from './../../app.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { DashboardComponent } from './dashboard.component';
import { DatamapComponent } from './datamap/datamap.component';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';
import { ChartsModule } from 'ng2-charts';
import 'chart.js/dist/Chart.js';
import { AgmCoreModule } from '@agm/core';
import { LocationComponent } from './location/location.component';
import { SiteInfoComponent } from './asset-info/site-info.component';
import { TheftInfoComponent } from './theft-batteryinfo/theft-batteryInfo.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { OrderModule } from 'ngx-order-pipe';
/// <reference types="@types/googlemaps" />
import { TabsModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { TranslateModule } from "@ngx-translate/core";
// import { MomentTimezoneModule } from 'angular-moment-timezone';
import { DragulaModule } from 'ng2-dragula';
import { SliderModule } from 'primeng/slider';
import { AgmDirectionModule } from 'agm-direction';
import { GoogleMapsAPIWrapper } from '@agm/core';
export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'asset-info', component: SiteInfoComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Asset Info', expectedRoles: ['Master', 'Tenant'] } },
  { path: 'theft-info', component: TheftInfoComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Theft Info', expectedRoles: ['Master', 'Tenant'] } }
];

declare var require: any;

const Highcharts = require('highcharts');
Highcharts.setOptions({
  global: {
    // timezoneOffset: new Date().getTimezoneOffset()
    useUTC: false
  },
  credits: {
    enabled: false
  }
});

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    DragulaModule,
    SliderModule,
    NgxDatatableModule,
    PipesModule,
    OrderModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    ChartModule,
    HttpModule,
    // MomentTimezoneModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCx_ZaqWDu6leZ7ffeIz5sG9qrN5s4KFF0',
      libraries: ["places"]
    }),
    AgmDirectionModule,
    // SharedModule,
    TranslateModule,
  ],
  declarations: [
    DashboardComponent,
    LocationComponent,
    SiteInfoComponent,
    TheftInfoComponent
  ]
})

export class DashboardModule { }
