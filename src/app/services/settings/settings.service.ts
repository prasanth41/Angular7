import { AppConfig } from './../../app.config';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StaticApis } from '../../shared/static-data/static-data';
import { environment } from '../../../environments/environment';
const httpOptions = {
     headers: new HttpHeaders({
          'Content-Type': 'application/json'
     })
};
@Injectable({ providedIn: 'root' })
export class SettingService {
     CONFIG_DATA: any
     headers: any;

     private getUserEndPoint: string = `${environment.app.url}${StaticApis.getUsersApiEndPoint}`;
     private updateUserEndPoint: string = `${environment.app.url}${StaticApis.updateUserApiEndPoint}`;

     private settingsApiEndPoint: string = `${environment.app.url}${StaticApis.resetPassword}`;
     constructor(private http: HttpClient, private _appConfig: AppConfig, ) {
          this.headers = this._appConfig.headers;
     }
     public resetPassword(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.settingsApiEndPoint, data, { headers: Headers })
               .pipe();
     }
     getUsers(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getUserEndPoint, data, { headers: Headers })
               .pipe();
     }
     updateUser(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.updateUserEndPoint, data, { headers: Headers })
               .pipe();
     }
}