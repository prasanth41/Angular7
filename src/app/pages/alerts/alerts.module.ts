import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertsComponent } from './alerts.component';
// import { CommonUtils } from '../../core/common-utils/common-utils.service';
// import { } from '@types/googlemaps';
import { TranslateModule } from "@ngx-translate/core";
export const routes = [
     { path: '', component: AlertsComponent, pathMatch: 'full' }
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
          TranslateModule
     ],
     declarations: [
          AlertsComponent
     ]
})
export class AlertsModule { }
