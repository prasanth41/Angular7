import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { StaticChecks } from '../../shared/static-data/static-data';

@Injectable({ providedIn: 'root' })
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private logger: NGXLogger, private translate: TranslateService, private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // check to see if there's internet
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      return Observable.throw(new HttpErrorResponse({ error: 'Internet is required.' }));

    } else {
      // else return the normal request
      return next.handle(request)
        .pipe(tap(data => {
          if (data instanceof HttpResponse) {
            // http response status code
            if (data.body.hasOwnProperty('returnedValue')) {
              let response: boolean = data.body.returnedValue.status;
              if (response) {
                return data.body;
              } else {
                // this.logger.error('HTTPSERVICE', 'APICALL', "results:" + JSON.stringify(data));
                let message: string = data.body.returnedValue.message;
                let exception: string = data.body.returnedValue.exception;
                if (message.toUpperCase().indexOf(StaticChecks.wrongToken) > -1) {
                  // jQuery("#sessionExpired-modal").modal("show");
                } else if (message.toUpperCase().indexOf(StaticChecks.accessForbidden) > -1) {
                  this.translate.get('HTTP_ERRORS.ACCESS_FORBIDDEN').subscribe((res: string) => {
                    this.toastr.error(res, '');
                  });
                } else if (message.toUpperCase().indexOf(StaticChecks.wrongPassword) > -1 || message.toUpperCase().indexOf(StaticChecks.invalidGrant) > -1) {
                  this.translate.get('HTTP_ERRORS.WRONG_PASSWORD').subscribe((res: string) => {
                    this.toastr.error(res, '');
                  });
                } else if (message.toUpperCase().indexOf(StaticChecks.exists) > -1) {
                  this.translate.get('HTTP_ERRORS.ALREADY_EXISTS').subscribe((res: string) => {
                    this.toastr.error(res, '');
                  });
                } else if (message.toUpperCase().indexOf(StaticChecks.invalidInput) > -1 || message.toUpperCase().indexOf(StaticChecks.emptyInput) > -1 || message.toUpperCase().indexOf(StaticChecks.objectNotFound) > -1) {
                  this.translate.get('HTTP_ERRORS.INVALID_INPUT').subscribe((res: string) => {
                    this.toastr.error(res, '');
                  });
                } else if (message.toUpperCase().indexOf(StaticChecks.devicesNotFound) > -1) {
                  this.translate.get('HTTP_ERRORS.DEVICES_NOT_FOUND').subscribe((res: string) => {
                    this.toastr.error(res, '');
                  });
                } else if (message.toUpperCase().indexOf(StaticChecks.duplicateParameters) > -1) {
                  this.translate.get('HTTP_ERRORS.DUPLICATE_PARAMETERS').subscribe((res: string) => {
                    this.toastr.error(res, '');
                  });
                } else if (message.toUpperCase().indexOf(StaticChecks.readingsNotFound) > -1) {
                  this.translate.get('HTTP_ERRORS.READINGS_NOT_FOUND').subscribe((res: string) => {
                    this.toastr.error(res, '');
                  });
                } else {
                  this.translate.get('HTTP_ERRORS.FAILED_TO_PROCESS').subscribe((res: string) => {
                    this.toastr.error(res, '');
                  });
                }
              }
            } else if (data.body.hasOwnProperty('results')) {
              if (data.body.results[0].length !== 0) {
                return data.body;
              }
            } else {
              let response: number = data.status;
              if (response === 200) {
                return data;
              }
            }
          }
        }, error => {
          // http response status code
          console.log("----response----");
          console.error(error.status);
          console.error(error.message);
          if (error.status === 403) {
            // jQuery("#sessionExpired-modal").modal("show");
          } else {
            this.translate.get('HTTP_ERRORS.SERVER_NOT_FOUND').subscribe((res: string) => {
              this.toastr.error(res, '');
            });
          }
          console.log("--- end of response---");
        }))

    }
  }
}
