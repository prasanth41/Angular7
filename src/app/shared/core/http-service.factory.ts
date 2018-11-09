import { LoaderService } from './../../services/loader/loader.service';
import { XHRBackend } from '@angular/http';
import { AngularReduxRequestOptions } from '../core/angular-redux-request.options';
import { HttpService } from '../core/http.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

function httpServiceFactory(backend: XHRBackend, options: AngularReduxRequestOptions, loaderService: LoaderService, toastrService: ToastrService, translate: TranslateService, logger: NGXLogger) {
     return new HttpService(backend, options, loaderService, toastrService, translate, logger);
}

export { httpServiceFactory };
