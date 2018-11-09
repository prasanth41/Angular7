import { LoaderService } from './../../services/loader/loader.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';
import {
     Http,
     RequestOptions,
     RequestOptionsArgs,
     Response,
     Request,
     Headers,
     XHRBackend
} from '@angular/http';

import { AngularReduxRequestOptions } from './angular-redux-request.options';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class HttpService extends Http {

     apiUrl = '';

     constructor(
          backend: XHRBackend,
          defaultOptions: AngularReduxRequestOptions,
          private loaderService: LoaderService,
          private toastrService: ToastrService,
          private translate: TranslateService,
          private logger: NGXLogger
     ) {
          super(backend, defaultOptions);
     }

     get(url: string, options?: RequestOptionsArgs): Observable<any> {

          this.showLoader();

          return super.get(this.getFullUrl(url), this.requestOptions(options))
               .catch(this.onCatch)
               .map((response: Response) => response.json())
               .filter(data => {
                    if (data.hasOwnProperty('returnedValue')) {
                    } else if (data.hasOwnProperty('results')) {
                    } else {
                         let response: number = data.status;
                         if (response === 200) {
                              return data;
                         }
                    }
               })
               .do((res: Response) => {
                    this.onSuccess(res);
               }, (error: any) => {
                    if (error.status === 403) {
                         jQuery("#sessionExpired-modal").modal("show");
                    } else {
                         this.translate.get('Menu.SERVER_NOT_FOUND').subscribe((res: string) => {
                              this.toastrService.error(res, '');
                         });
                    }
                    this.onError(error);
               })
               .finally(() => {
                    this.onEnd();
               });

     }

     post(url: string, data: any, options?: RequestOptionsArgs): Observable<any> {

          this.showLoader();
          return super.post(this.getFullUrl(url), this.getData(data), this.requestOptions(options))
               .catch(this.onCatch)
               .map((response: Response) => response.json())
               .filter(data => {
                    if (data.hasOwnProperty('returnedValue')) {
                         let response: boolean = data.returnedValue.status;
                         if (response) {
                              return data;
                         } else {
                              this.logger.error('HTTPSERVICE', 'APICALL', "results:" + JSON.stringify(data));
                              let message: string = data.returnedValue.message;
                              let exception: string = data.returnedValue.exception;

                              if (message.indexOf('WRONG_TOKEN') > -1) {
                                   jQuery("#sessionExpired-modal").modal("show");
                              } else if (message === 'Access to this resource is forbidden.') {
                                   this.translate.get('HTTP_ERRORS.ACCESS_FORBIDDEN').subscribe((res: string) => {
                                        this.toastrService.error(res, '');
                                   });
                              } else if (message.indexOf('WRONG_PASSWORD') > -1 || message.indexOf('invalid_grant') > -1) {
                                   this.translate.get('HTTP_ERRORS.WRONG_PASSWORD').subscribe((res: string) => {
                                        this.toastrService.error(res, '');
                                   });
                              } else if (message.includes('already exists') || message.includes('Name exists')) {
                                   this.translate.get('HTTP_ERRORS.ALREADY_EXISTS').subscribe((res: string) => {
                                        this.toastrService.error(res, '');
                                   });
                              } else if (message.includes('INVALID_INPUT_DATA') || message.includes('Invalid/Empty input') || message.includes('OBJECT_NOT_FOUND')) {
                                   this.translate.get('HTTP_ERRORS.INVALID_INPUT').subscribe((res: string) => {
                                        this.toastrService.error(res, '');
                                   });
                              } else if (message.includes('Devices not found')) {
                                   this.translate.get('HTTP_ERRORS.DEVICES_NOT_FOUND').subscribe((res: string) => {
                                        this.toastrService.error(res, '');
                                   });
                              } else if (message.includes('There are duplicate/missing parameters in properties.')) {
                                   this.translate.get('HTTP_ERRORS.DUPLICATE_PARAMETERS').subscribe((res: string) => {
                                        this.toastrService.error(res, '');
                                   });
                              } else if (message.includes('Readings not found')) {
                                   this.translate.get('HTTP_ERRORS.READINGS_NOT_FOUND').subscribe((res: string) => {
                                        this.toastrService.error(res, '');
                                   });
                              } else {
                                   this.translate.get('HTTP_ERRORS.FAILED_TO_PROCESS').subscribe((res: string) => {
                                        this.toastrService.error(res, '');
                                   });
                              }
                         }
                    } else if (data.hasOwnProperty('results')) {
                         if (data.results[0].length !== 0) {
                              return data;
                         }
                    } else if (data.hasOwnProperty('updated')) {
                         return data;
                    } else {
                         let response: any = data.status;
                         if (response === 200) {
                              return data;
                         } else if (response === 'APPROVED') {
                              return data;
                         }
                    }
               })
               .do((res: Response) => {
                    this.onSuccess(res);
               }, (error: any) => {
                    if (error.status === 403) {
                         jQuery("#sessionExpired-modal").modal("show");
                    } else {
                         this.translate.get('Menu.SERVER_NOT_FOUND').subscribe((res: string) => {
                              this.toastrService.error(res, '');
                         });
                    }
               })
               .finally(() => {
                    this.onEnd();
               });
     }

     private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {

          if (options == null) {
               options = new AngularReduxRequestOptions();
          }

          if (options.headers == null) {
               options.headers = new Headers();
          }

          return options;
     }

     private getFullUrl(url: string): string {
          return this.apiUrl + url;
     }

     private getData(data: any): any {
          return data;
     }

     private onCatch(error: any, caught: Observable<any>): Observable<any> {
          return Observable.throw(error);
     }

     private onSuccess(res: Response): void {
          this.logger.info('HTTPSERVICE', 'OnSuccess', "Request successful");
     }

     private onError(res: Response): void {
          this.logger.error('HTTPSERVICE', 'OnError', 'Error, status code: ' + res.status);
     }

     private onEnd(): void {
          this.hideLoader();
     }

     private showLoader(): void {
          this.loaderService.show();
     }

     private hideLoader(): void {
          this.loaderService.hide();
     }
}
