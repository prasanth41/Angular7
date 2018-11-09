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
export class DashboardService {
     headers: any;
     private getAssetsApiEndPoint: string = `${environment.app.url}${StaticApis.getAssetsApiEndPoint}`;
     private getTenantsApiEndPoint: string = `${environment.app.url}${StaticApis.getTenantsApiEndPoint}`;
     private getAssetsServiceApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getAssetsServiceApiEndPoint}`;
     constructor(private http: HttpClient, private _appConfig: AppConfig, ) {
          this.headers = this._appConfig.headers;
     }
     public getAssets(data: any): Observable<any> {
          return this.http.post<any>(this.getAssetsApiEndPoint, data, httpOptions)
               .pipe();
     }

     public getAssetsService(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getAssetsServiceApiEndPoint + tenantId, data, { headers: Headers })
               .pipe();
     }
     public getTenants(data: any): Observable<any> {
          return this.http.post<any>(this.getTenantsApiEndPoint, data, httpOptions)
               .pipe();
     }

}