import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StaticApis } from '../../shared/static-data/static-data';
import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({ providedIn: 'root' })
export class TenantsService {
  private getTenantsEndPoint: string = `${environment.app.url}${StaticApis.getTenantsApiEndPoint}`;
  private getTenantDetailsEndPoint: string = `${environment.app.url}${StaticApis.getTenantDetailsApiEndPoint}`;
  private addTenantEndPoint: string = `${environment.app.url}${StaticApis.addTenantApiEndPoint}`;
  private updateTenantEndPoint: string = `${environment.app.url}${StaticApis.updateTenantApiEndPoint}`;
  private deleteTenantEndPoint: string = `${environment.app.url}${StaticApis.deleteTenantApiEndPoint}`;

  constructor(private http: HttpClient) { }

  getTenants(data: any): Observable<any> {
    return this.http.post<any>(this.getTenantsEndPoint, data, httpOptions)
      .pipe();
  }
  getTenantDetails(data: any): Observable<any> {
    return this.http.post<any>(this.getTenantDetailsEndPoint, data, httpOptions)
      .pipe();
  }
  addTenant(data: any): Observable<any> {
    return this.http.post<any>(this.addTenantEndPoint, data, httpOptions)
      .pipe();
  }
  updateTenant(data: any): Observable<any> {
    return this.http.post<any>(this.updateTenantEndPoint, data, httpOptions)
      .pipe();
  }
  deleteTenant(data: any): Observable<any> {
    return this.http.post<any>(this.deleteTenantEndPoint, data, httpOptions)
      .pipe();
  }

}
