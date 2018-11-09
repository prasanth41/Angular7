import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StaticApis } from '../../../shared/static-data/static-data';
import { environment } from '../../../../environments/environment';
import { AppConfig } from "../../../app.config";

const httpOptions = {
     headers: new HttpHeaders({
          'Content-Type': 'application/json'
     })
};
@Injectable()
export class SiteInfoService {
     headers: any;
     CONFIG_DATA: any

     private getCellReadingsApiEndpoint: string = `${environment.app.url}${StaticApis.getCellReadingsApiEndpoint}`;
     private getTrendChartApiEndPoint: string = `${environment.app.url}${StaticApis.getTrendChartApiEndPoint}`;
     private getSensorReadingsApiEndPoint: string = `${environment.app.url}${StaticApis.getSensorReadingsApiEndPoint}`;
     private getFaultyCellsApiEndPoint: string = `${environment.app.url}${StaticApis.getFaultyCellsApiEndPoint}`;
     private getAssetInfoApiEndPoint: string = `${environment.app.url}${StaticApis.getAssetInfoApiEndPoint}`;
     private getDischargeCyclesApiEndPoint: string = `${environment.app.url}${StaticApis.getDischargeCyclesApiEndPoint}`;
     private getChargeCyclesApiEndPoint: string = `${environment.app.url}${StaticApis.getChargeCyclesApiEndPoint}`;
     private getAssetsApiEndPoint: string = `${environment.app.url}${StaticApis.getAssetsApiEndPoint}`;

     private getTemperatureApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getTemperatureApiEndpoint}`;
     private getAhoutInfoApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getAhoutInfoApiEndpoint}`;
     private getVoltagesApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getVoltagesApiEndpoint}`;
     private getcharge_dischargeVoltageApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getcharge_dischargeVoltageApiEndpoint}`;
     private getCharge_dischargeAHApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getCharge_dischargeAHApiEndpoint}`;
     constructor(private http: HttpClient, private _appConfig: AppConfig) {
          this.headers = this._appConfig.headers;
          this.CONFIG_DATA = this._appConfig.CONFIG_DATA;

     }
     public getDeviceAndReadings(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getCellReadingsApiEndpoint, data, { headers: Headers })
               .pipe();
     }
     public getTrendChart(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;

          return this.http.post<any>(this.getTrendChartApiEndPoint, data, { headers: Headers })
               .pipe();
     }
     public getDeviceReadingsInTrendGraph(data: any): Observable<any> {
          return this.http.post<any>(this.getSensorReadingsApiEndPoint, data, httpOptions)
               .pipe();
     }
     public getWeakCellsData(data: any): Observable<any> {
          return this.http.post<any>(this.getFaultyCellsApiEndPoint, data, httpOptions)
               .pipe();
     }
     public getDeviceReadings(data: any): Observable<any> {
          return this.http.post<any>(this.getSensorReadingsApiEndPoint, data, httpOptions)
               .pipe();
     }
     public getAssetInfo(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getAssetInfoApiEndPoint, data, { headers: Headers })
               .pipe();
     }

     public getDischargeCycles(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getDischargeCyclesApiEndPoint, data, { headers: Headers })
               .pipe();
     }
     public getChargeCycles(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getChargeCyclesApiEndPoint, data, { headers: Headers })
               .pipe();
     }

     public getTemperatureInfo(data: any, tenantId: any, assetId: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getTemperatureApiEndpoint + tenantId + '&assetId=' + assetId, data, { headers: Headers })
               .pipe();
     }
     public getAhoutInfo(data: any, tenantId: any, assetId: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getAhoutInfoApiEndpoint + tenantId, data, { headers: Headers })
               .pipe();
     }
     public voltages(data: any, tenantId: any, assetId: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getVoltagesApiEndpoint + tenantId, data, { headers: Headers })
               .pipe();
     }
     public charge_dischargeVoltageChartInfo(data: any, tenantId: any, assetId: any, chargeType: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getcharge_dischargeVoltageApiEndpoint + tenantId, data, { headers: Headers })
               .pipe();
     }
     public charge_dischargeAHChartInfo(data: any, tenantId: any, assetId: any, chargeType: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getCharge_dischargeAHApiEndpoint + tenantId, data, { headers: Headers })
               .pipe();
     }
}