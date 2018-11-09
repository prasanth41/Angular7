import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { UsersComponent } from './users.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { SharedModule } from '../../shared/shared.module';
export const routes = [
  { path: '', component: UsersComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    InternationalPhoneNumberModule
  ],
  declarations: [
    UsersComponent
  ]
})
export class UsersModule { }
