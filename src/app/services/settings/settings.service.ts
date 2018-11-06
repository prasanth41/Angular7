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
     private settingsApiEndPoint: string = `${environment.app.url}${StaticApis.resetPassword}`;
     constructor(private http: HttpClient) {
     }
     public resetPassword(data: any): Observable<any> {
          return this.http.post<any>(this.settingsApiEndPoint, data, httpOptions)
               .pipe();
     }
}