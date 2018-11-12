import { SharedModule } from './../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { AnalyticsComponent } from './analytics.component';
import { ChartModule } from 'angular-highcharts';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SelectDropDownModule } from 'ngx-select-dropdown';
export const routes = [
     { path: '', component: AnalyticsComponent, pathMatch: 'full' }
];
@NgModule({
     imports: [
          MultiselectDropdownModule,
          CommonModule,
          FormsModule,
          HttpClientModule,
          ReactiveFormsModule,
          DirectivesModule,
          PipesModule,
          RouterModule.forChild(routes),
          BsDatepickerModule.forRoot(),
          TranslateModule,
          ChartModule,
          SelectDropDownModule,
          SharedModule
     ],
     declarations: [
          AnalyticsComponent
     ]
})
export class AnalyticsModule { }