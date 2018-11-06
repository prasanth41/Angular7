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
export class UsersService {
  private getUserEndPoint: string = `${environment.app.url}${StaticApis.getUsersApiEndPoint}`;
  private addUserEndPoint: string = `${environment.app.url}${StaticApis.addUserApiEndPoint}`;
  private updateUserEndPoint: string = `${environment.app.url}${StaticApis.updateUserApiEndPoint}`;
  private deleteUserEndPoint: string = `${environment.app.url}${StaticApis.deleteUserApiEndPoint}`;

  constructor(private http: HttpClient) { }

  getUsers(data: any): Observable<any> {
    return this.http.post<any>(this.getUserEndPoint, data, httpOptions)
      .pipe();
  }
  addUser(data: any): Observable<any> {
    return this.http.post<any>(this.addUserEndPoint, data, httpOptions)
      .pipe();
  }
  updateUser(data: any): Observable<any> {
    return this.http.post<any>(this.updateUserEndPoint, data, httpOptions)
      .pipe();
  }
  deleteUser(data: any): Observable<any> {
    return this.http.post<any>(this.deleteUserEndPoint, data, httpOptions)
      .pipe();
  }

}
