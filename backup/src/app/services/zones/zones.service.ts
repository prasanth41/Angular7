import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StaticApis } from '../../shared/static-data/static-data';
import { environment } from '../../../environments/environment';
const httpOptions = {
     headers: new HttpHeaders({
          'Content-Type': 'application/json'
     })
};
@Injectable()
export class ZonesService {
     private getZoneEndPoint: string = `${environment.app.url}${StaticApis.getZonesApiEndPoint}`;
     private addZoneEndPoint: string = `${environment.app.url}${StaticApis.addZoneApiEndPoint}`;
     private updateZoneEndPoint: string = `${environment.app.url}${StaticApis.updateZoneApiEndpoint}`;
     private deleteZoneEndPoint: string = `${environment.app.url}${StaticApis.deleteZoneApiEndPoint}`;

     constructor(private http: HttpClient) { }

     getZones(data: any): Observable<any> {
          return this.http.post<any>(this.getZoneEndPoint, data, httpOptions)
               .pipe();
     }
     addZone(data: any): Observable<any> {
          return this.http.post<any>(this.addZoneEndPoint, data, httpOptions)
               .pipe();
     }
     updateZone(data: any): Observable<any> {
          return this.http.post<any>(this.updateZoneEndPoint, data, httpOptions)
               .pipe();
     }
     deleteZone(data: any): Observable<any> {
          return this.http.post<any>(this.deleteZoneEndPoint, data, httpOptions)
               .pipe();
     }
}