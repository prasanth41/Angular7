import { SharedModule } from './../../shared/shared.module';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { SettingsComponent } from './settings.component';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '../../app.module';
import { TabsModule } from 'ngx-bootstrap';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";
export const routes = [
     { path: '', component: SettingsComponent, pathMatch: 'full' },
];

@NgModule({
     imports: [
          CommonModule,
          HttpClientModule,
          DirectivesModule,
          PipesModule,
          InternationalPhoneNumberModule,
          FormsModule,
          ReactiveFormsModule,
          SharedModule,
          RouterModule.forChild(routes),
          TabsModule.forRoot(),
          TranslateModule
     ],
     declarations: [
          SettingsComponent
     ]
})
export class SettingsModule { }
