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

@Injectable({ providedIn: 'root' })
export class ForgotPassService {
     private forgotPasswordApiEndPoint: string = `${environment.app.url}${StaticApis.forgotpassword}`;

     constructor(private http: HttpClient) { }

     forgotPassword(data: any): Observable<any> {
          return this.http.post<any>(this.forgotPasswordApiEndPoint, data, httpOptions)
               .pipe();
     }

}