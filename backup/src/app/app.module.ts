import 'pace';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { routing } from './app.routing';
import { AppConfig } from './app.config';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './pages/error/error.component';
import { ToastrModule } from 'ngx-toastr';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE',
      libraries: ["places"]
    }),
    ToastrModule.forRoot(),
    routing,
    SharedModule
  ],
  providers: [AppConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class AuthGuard {
  constructor(private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (typeof (Storage) !== "undefined") {
      if (sessionStorage.getItem('sessionInfo')) {
        const expectedRoles = route.data.expectedRoles;
        const role = JSON.parse(sessionStorage.getItem('sessionInfo')).tenantType;
        if (expectedRoles.indexOf(role) > -1 || expectedRoles.indexOf(role) > -1)
          return Promise.resolve(true);
        else {
          this.router.navigate(['/pages/dashboard']);
          return Promise.resolve(true);
        }
      }
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return Promise.resolve(false);
  }
}