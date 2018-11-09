import { LoaderService } from './../../services/loader/loader.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XHRBackend, RequestOptions } from '@angular/http';
import { HttpService } from './http.service';
import { httpServiceFactory } from './http-service.factory';
import { AngularReduxRequestOptions } from './angular-redux-request.options';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoaderComponent } from './loader/loader.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoggerModule, NgxLoggerLevel, NGXLogger } from 'ngx-logger';

export function HttpLoaderFactory(httpClient: HttpClient) {
     return new TranslateHttpLoader(httpClient, "assets/i18n/", ".json");
}

@NgModule({
     imports: [
          CommonModule,
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
          ToastrModule.forRoot()
     ],
     exports: [
          LoaderComponent
     ],
     declarations: [
          LoaderComponent
     ],
     providers: [
          LoaderService,
          ToastrService,
          TranslateService,
          NGXLogger,
          {
               provide: HttpService,
               useFactory: httpServiceFactory,
               deps: [XHRBackend, RequestOptions, LoaderService, ToastrService, TranslateService, NGXLogger]
          }
     ]
})

export class CoreModule { }
