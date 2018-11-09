import { isValid } from './../../shared/utils/utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StaticApis } from '../../shared/static-data/static-data';
import { environment } from '../../../environments/environment';
import { AppConfig } from "../../app.config";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const httpOptions = {
     headers: new HttpHeaders({
          'Content-Type': 'application/json'
     })
};

@Injectable()
export class DashboardService {
     headers: any;
     private inputFilterData: any;
     private batteryData: any;
     private filterData = new BehaviorSubject<any>({ personId: 1 });
     currentFilterData = this.filterData.asObservable();

     private getAssetsApiEndPoint: string = `${environment.app.url}${StaticApis.getAssetsApiEndPoint}`;
     private deleteAssetsApiEndPoint: string = `${environment.app.url}${StaticApis.deleteAssetsApiEndPoint}`;
     private getZonesApiEndPoint: string = `${environment.app.url}${StaticApis.getZonesApiEndPoint}`;
     private getModelsApiEndPoint: string = `${environment.app.url}${StaticApis.getModelsApiEndPoint}`;

     private getTenantsApiEndPoint: string = `${environment.app.url}${StaticApis.getTenantsApiEndPoint}`;

     private getAssetsServiceApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getAssetsServiceApiEndPoint}`;
     private getHealthStateDataApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getHealthStateDataApiEndpoint}`;
     private getBatteryStatusServiceApiEndpoint: string = `${environment.kafkaUrl}${StaticApis.getBatteryStatusServiceApiEndpoint}`;
     private getBatteryStatusListServiceApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getBatteryStatusListServiceApiEndPoint}`;
     private getChargeStateServiceApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getChargeStateServiceApiEndPoint}`;
     private getHealthStateServiceApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getHealthStateServiceApiEndPoint}`;
     private getMonitoredBatteryServiceApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getMonitoredBatteryServiceApiEndPoint}`;
     private getStatusApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getStatusApiEndPoint}`;
     private getIssuesApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getIssuesApiEndPoint}`;
     private getWeakBatteryCellCountApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getWeakBatteryCellCountApiEndPoint}`;
     private getTheftBatteryCellCountApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getTheftBatteryCellCountApiEndPoint}`;
     private getWeakBatteryCellsApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getWeakBatteryCellsApiEndPoint}`;
     private getTheftBatteryBanksApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getTheftBatteryBanksApiEndPoint}`;
     private getHealthStateDataApiEndPoint: string = `${environment.kafkaUrl}${StaticApis.getHealthStateDataApiEndPoint}`;
     CONFIG_DATA: any


     constructor(private http: HttpClient, private _appConfig: AppConfig, ) {
          this.headers = this._appConfig.headers;
          this.CONFIG_DATA = this._appConfig.CONFIG_DATA;

     }

     public getAssetsService(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getAssetsServiceApiEndPoint + tenantId, data, { headers: Headers })
               .pipe();
     }

     public getBatteryStatusService(tenantId: any, type: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getBatteryStatusServiceApiEndpoint + tenantId + '&internal_name=' + type, data, { headers: Headers })
               .pipe();
     }

     public getBatteryStatusListService(tenantId: any, type: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getBatteryStatusListServiceApiEndPoint + tenantId + '&internal_name=' + type, data, { headers: Headers })
               .pipe();
     }

     //set filter  data
     setFilterData(data: any) {
          this.filterData.next(data)
          console.log("@@@@@@1234" + JSON.stringify(data));

     }

     //get filter  data
     getFilterData() {
          return this.inputFilterData;
     }

     //set monitoredbank data
     public setMonitoredBankData(data: {}) {
          this.batteryData = data;
     }

     //get monitoredbank data
     public getMonitoredBankData() {
          return this.batteryData;
     }





     public getMonitoredBatteryService(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getMonitoredBatteryServiceApiEndPoint + tenantId, data, { headers: Headers })
               .pipe();
     }

     public getChargeStateService(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getChargeStateServiceApiEndPoint + tenantId, data, { headers: Headers })
               .pipe();
     }

     public getHealthStateService(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getHealthStateServiceApiEndPoint + tenantId, data, { headers: Headers })
               .pipe();
     }

     public getAssets(data: any): Observable<any> {
          return this.http.post<any>(this.getAssetsApiEndPoint, data, httpOptions)
               .pipe();
     }

     public getTenants(data: any): Observable<any> {
          return this.http.post<any>(this.getTenantsApiEndPoint, data, httpOptions)
               .pipe();
     }

     public deleteAsset(data: any): Observable<any> {
          return this.http.post<any>(this.deleteAssetsApiEndPoint, data, httpOptions)
               .pipe();
     }

     public getZones(data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getZonesApiEndPoint, data, { headers: Headers })
               .pipe();
     }


     // public getZones(data) {
     //      let Headers = this.headers;
     //      alert(this.CONFIG_DATA.SERVER_URL1 + 'getZones')
     //      return this.http.post(this.CONFIG_DATA.SERVER_URL1 + 'getZones', data, {
     //           headers: Headers
     //      }).map((res: Response) => {
     //           return res;
     //      });
     // };

     public getModels(data: any): Observable<any> {
          return this.http.post<any>(this.getModelsApiEndPoint, data, httpOptions)
               .pipe();
     }
     public getStatus(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getStatusApiEndPoint + tenantId, data, { headers: Headers })
               .pipe();
     }
     public getIssues(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getIssuesApiEndPoint + tenantId, data, { headers: Headers })
               .pipe();
     }
     public getWeakBatteryCellCount(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getWeakBatteryCellCountApiEndPoint + tenantId + '&internal_name=cell voltage', data, { headers: Headers })
               .pipe();
     }
     public getTheftBatteryCellCount(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getTheftBatteryCellCountApiEndPoint + tenantId + '&internal_name=movement', data, { headers: Headers })
               .pipe();
     }

     public getWeakBatteryCells(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getWeakBatteryCellsApiEndPoint + tenantId + '&internal_name=cell voltage', data, { headers: Headers })
               .pipe();
     }

     public getTheftBatteryBanks(tenantId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getTheftBatteryBanksApiEndPoint + tenantId + '&internal_name=movement', data, { headers: Headers })
               .pipe();
     }
     public getHealthStateData(tenantId: any, assetId: any, data: any): Observable<any> {
          let Headers = this.headers;
          return this.http.post<any>(this.getHealthStateDataApiEndpoint + tenantId + '&assetId=' + assetId, data, { headers: Headers })
               .pipe();
     }
     public setIsEveryWhere(value) {
          sessionStorage.setItem('viewInfo', JSON.stringify(value));
     }

     public getIsEveryWhere() {
          var viewInfo = {}
          if (isValid(JSON.parse(sessionStorage.getItem('viewInfo')))) {
               return JSON.parse(sessionStorage.getItem('viewInfo'));
          } else {
               return {
                    isEveryWhereEnabled: false
               }
          }
     }
     public setIsChecked(value) {
          sessionStorage.setItem('checkedInfo', JSON.stringify(value));
     }
     public getIsChecked() {
          var checkedInfo = {}
          if (isValid(JSON.parse(sessionStorage.getItem('checkedInfo')))) {
               return JSON.parse(sessionStorage.getItem('checkedInfo'));
          } else {
               return {
                    Name: true,
                    healthState: true,
                    zone: false,
                    temperature: true,
                    overAll_Voltage: true,
                    state: true,
                    SOC: true,
                    dischargeCells: true,
                    weakCells: false
               }
          }
     }
     public setIsCardChecked(value) {
          sessionStorage.setItem('cardCheckedInfo', JSON.stringify(value));
     }
     public getIsCardChecked() {
          var checkedInfo = {}
          if (isValid(JSON.parse(sessionStorage.getItem('cardCheckedInfo')))) {
               return JSON.parse(sessionStorage.getItem('cardCheckedInfo'));
          } else {
               return {
                    healthState: true,
                    chargingState: true,
                    weakBatteries: true,
                    theftBatteries: true
               }
          }
     }
     //Session Storage of asset fliter data
     public setAssetsFilter(filterData) {
          sessionStorage.setItem('assetFilterInfo', JSON.stringify(filterData));
     };

     //Get assets filter data
     public getAssetsFilterData() {
          var assetFilterInfo = {};
          if (isValid(JSON.parse(sessionStorage.getItem('assetFilterInfo')))) {
               return JSON.parse(sessionStorage.getItem('assetFilterInfo'));
          } else {
               return {
                    tenant: 'All',
                    status: ['All'],
                    model: 'All',
                    address: '',
                    radius: 50,
                    chargeStatus: ['All'],
                    zones: [],
                    // isEveryWhereEnabled: false,
                    healthStatusColor: '',
                    chargeStatusColor: '',

               }
          }
     }

}