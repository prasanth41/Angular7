import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StaticApis } from '../../../shared/static-data/static-data';
import { environment } from '../../../../environments/environment';
const httpOptions = {
     headers: new HttpHeaders({
          'Content-Type': 'application/json'
     })
};
@Injectable()
export class ZoneInfoService {
     private assignUserToZoneApiEndPoint: string = `${environment.app.url}${StaticApis.assignUserToZoneApiEndPoint}`;
     private assignAssetToZoneApiEndPoint: string = `${environment.app.url}${StaticApis.assignAssetToZoneApiEndPoint}`;
     private unassignUserFromZoneApiEndPoint: string = `${environment.app.url}${StaticApis.unassignUserFromZoneApiEndPoint}`;
     private unAssignAssetFromZoneApiEndPoint: string = `${environment.app.url}${StaticApis.unAssignAssetFromZoneApiEndPoint}`;
     constructor(private http: HttpClient) { }
     assignUserToZone(data: any): Observable<any> {
          return this.http.post<any>(this.assignUserToZoneApiEndPoint, data, httpOptions)
               .pipe();
     }
     assignAssetToZone(data: any): Observable<any> {
          return this.http.post<any>(this.assignAssetToZoneApiEndPoint, data, httpOptions)
               .pipe();
     }
     unassignUserFromZone(data: any): Observable<any> {
          return this.http.post<any>(this.unassignUserFromZoneApiEndPoint, data, httpOptions)
               .pipe();
     }
     unassignAssetFromZone(data: any): Observable<any> {
          return this.http.post<any>(this.unAssignAssetFromZoneApiEndPoint, data, httpOptions)
               .pipe();
     }
}