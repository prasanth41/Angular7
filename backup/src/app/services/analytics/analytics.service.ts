import { AnalyticsFilter } from './../../models/analytics-filter';
import { isValid } from './../../shared/utils/utils';
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
export class AnalyticsService {
     headers: any;
     private getSensorIssuesApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getSensorIssuesApiEndpoint}`;
     private getAssetIssuesApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getAssetIssuesApiEndpoint}`;
     private getTemperatureInfoApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getTemperatureInfoApiEndpoint}`;
     constructor(private http: HttpClient, private _appConfig: AppConfig, ) {
          this.headers = this._appConfig.headers;
     }

     public getSensorIssues(data: any, tenantId: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getSensorIssuesApiEndpoint + tenantId, data, { headers: Headers })
               .pipe();
     }
     public getAssetIssues(data: any, tenantId: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getAssetIssuesApiEndpoint + tenantId, data, { headers: Headers })
               .pipe();
     }
     public getTemperatureInfo(data: any, tenantId: any, assetId): Observable<any> {
          console.log(this.getTemperatureInfoApiEndpoint + tenantId + '&assetId=' + assetId)
          let Headers = this.headers;
          return this.http.post<any>(this.getTemperatureInfoApiEndpoint + tenantId + '&assetId=' + assetId, data, { headers: Headers })
               .pipe();
     }
     //Session Storage of analytics fliter data
     public setAnalyticsFilter(filterData) {
          sessionStorage.setItem('analyticInfo', JSON.stringify(filterData));
     };

     //Get analytics filter data
     public getAnalyticsFilterData() {
          let analyticInfo: AnalyticsFilter = new AnalyticsFilter();
          let today = new Date();

          // for one month
          let fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
          let toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

          // for one week
          //let firstday = new Date(today.getFullYear(), (today.getMonth()), (today.getDate() - today.getDay()));
          //let lastday = new Date(today.getFullYear(), (today.getMonth()), ((today.getDate() - today.getDay()) + 6));
          // for one day
          let firstday = new Date(today.getFullYear(), (today.getMonth()), (today.getDate()));
          let lastday = new Date(today.getFullYear(), (today.getMonth()), (today.getDate()));
          if (isValid(JSON.parse(sessionStorage.getItem('analyticInfo')))) {
               return JSON.parse(sessionStorage.getItem('analyticInfo'));
          } else {
               return new AnalyticsFilter(firstday, lastday, 'All', '', '', 'Temperature');
          }
     }
}