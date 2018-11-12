import { SharedModule } from './../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusinessRulesComponent } from './business-rules.component';
import { TranslateModule } from "@ngx-translate/core";
export const routes = [
     { path: '', component: BusinessRulesComponent, pathMatch: 'full' }
];

@NgModule({
     imports: [
          CommonModule,
          HttpClientModule,
          FormsModule,
          NgxDatatableModule,
          DirectivesModule,
          ReactiveFormsModule,
          RouterModule.forChild(routes),
          TranslateModule,
          SharedModule
     ],
     declarations: [
          BusinessRulesComponent
     ]
})
export class BusinessRulesModule { }
