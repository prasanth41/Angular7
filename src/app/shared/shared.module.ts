import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';
import { httpInterceptorProviders } from '../services/http-interceptors/index';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgHttpLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LoggerModule.forRoot({
      serverLoggingUrl: '',
      serverLogLevel: NgxLoggerLevel.OFF,
      level: NgxLoggerLevel.TRACE
    }),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.none,
    }),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    NgHttpLoaderModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule
  ],
  providers: [httpInterceptorProviders]
})
export class SharedModule {
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }
}
