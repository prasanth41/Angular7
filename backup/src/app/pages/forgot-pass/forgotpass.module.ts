import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPassComponent } from './forgotpass.component';

export const routes = [
     { path: '', component: ForgotPassComponent, pathMatch: 'full' }
];

@NgModule({
     imports: [
          SharedModule,
          RouterModule.forChild(routes),
     ],
     declarations: [ForgotPassComponent]
})

export class ForgotPassModule {
}