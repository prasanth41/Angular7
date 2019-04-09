import { Session } from './../../models/Session';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConfig } from "../../../app/app.config";
@Injectable()
export class NavbarService {
     private headers: any;
     private getMobileAppUrlheaders: any;
     private sendMessageHeaders: any;
     private CONFIG_DATA: any;
     private token = "";
     private session: Session
     constructor(private http: HttpClient, private _appConfig: AppConfig) {
          this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
          this.token = this.session.token;
          this.getMobileAppUrlheaders = {
               'Content-Type': 'application/vnd.kii.QueryRequest+json',
               'Authorization': 'Bearer ' + this.token
          };
          this.headers = this._appConfig.headers;
          this.sendMessageHeaders = {
               'Content-Type': 'application/json',
          };
          this.CONFIG_DATA = this._appConfig.CONFIG_DATA;
     }

     public getMobileAppUrls(data): Observable<any> {
          var Headers = this.getMobileAppUrlheaders;
          return this.http.post<any>(this.CONFIG_DATA.Mobile_App_url + "buckets/AM_MobileApps/query", data, {
               headers: Headers
          }).pipe();
     }

     public sendLink(data): Observable<any> {
          var Headers = this.sendMessageHeaders;
          return this.http.post(this.CONFIG_DATA.BROADCAST_URL, data, {
               headers: Headers
          }).pipe()
     };

}