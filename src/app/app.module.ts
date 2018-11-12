import { CoreModule } from './shared/core/core.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { LoaderComponent } from './shared/core/loader/loader.component';
import 'pace';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { routing } from './app.routing';
import { AppConfig } from './app.config';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './pages/error/error.component';
import { ToastrModule } from 'ngx-toastr';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OrderModule } from 'ngx-order-pipe';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as exporting from 'highcharts/modules/exporting.src';
import * as exportData from 'highcharts/modules/export-data.js';
import { Injectable } from '@angular/core';

@Injectable()
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
@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    // LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCx_ZaqWDu6leZ7ffeIz5sG9qrN5s4KFF0',
      libraries: ["places"]
    }),
    ToastrModule.forRoot(),
    routing,
    SharedModule,
    ChartModule,
    OrderModule,
    HttpClientModule,
    HttpModule,
    CoreModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LoggerModule.forRoot({
      serverLoggingUrl: '',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF
    }),
  ],
  providers: [GoogleMapsAPIWrapper, AppConfig, AuthGuard, { provide: HIGHCHARTS_MODULES, useFactory: () => [exporting, exportData] }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "assets/i18n/", ".json");
}