import { AlertFilter } from './../../models/filter';
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
export class AlertsService {
     private alertsApiEndPoint: string = `${environment.app.url}${StaticApis.getAlerts}`;
     constructor(private http: HttpClient) {

     }
     /**
** This function is used for get alerts api
*/

     public getAlerts(data: any): Observable<any> {
          return this.http.post<any>(this.alertsApiEndPoint, data, httpOptions)
               .pipe();
     }
     /**
** This function is used for set filter info for alerts
*/
     public setAlertsFilter(filterData) {
          sessionStorage.setItem('alertInfo', JSON.stringify(filterData));
     };
     /**
** This function is used for get filter info for alerts
*/
     public getAlertsFilterData() {
          let alertInfo: AlertFilter = new AlertFilter();
          if (isValid(JSON.parse(sessionStorage.getItem('alertInfo')))) {
               return JSON.parse(sessionStorage.getItem('alertInfo'));
          } else {
               return new AlertFilter('', '', '', '');
          }

     }
}