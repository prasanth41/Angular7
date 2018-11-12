import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StaticApis } from '../../shared/static-data/static-data';
import { environment } from '../../../environments/environment';
import { AppConfig } from "../../app.config";

const httpOptions = {
     headers: new HttpHeaders({
          'Content-Type': 'application/json'
     })
};

@Injectable()
export class BusinessRulesService {
     headers: any;
     private deployAndUpdateRulesApiEndpoint: string = `${environment.app.url}${StaticApis.deployAndUpdateRulesApiEndpoint}`;
     private isValidTokenApiEndpoint: string = `${environment.app.url}${StaticApis.isValidTokenApiEndpoint}`;
     constructor(private http: HttpClient, private _appConfig: AppConfig, ) {
          this.headers = this._appConfig.headers;
     }

     public deployAndUpdateRules(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.deployAndUpdateRulesApiEndpoint, data, { headers: Headers })
               .pipe();
     }
     public isValidToken(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.isValidTokenApiEndpoint, data, { headers: Headers })
               .pipe();
     }
}