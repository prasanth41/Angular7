// import { Injectable } from '@angular/core';
// // import { HttpService } from '../../../core/http.service';
// import { AppConfig } from "../../../app.config";
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Injectable()
// export class NavbarService {

//   headers: any;
//   getMobileAppUrlheaders: any;
//   sendMessageHeaders: any;
//   CONFIG_DATA: any;
//   private token = "";
//   constructor(private http: HttpClient, private _appConfig: AppConfig) {
//     this.token = JSON.parse(sessionStorage.getItem('sessionInfo')).token;
//     this.getMobileAppUrlheaders = {
//       'Content-Type': 'application/vnd.kii.QueryRequest+json',
//       'Authorization': 'Bearer ' + this.token
//     };
//     this.headers = this._appConfig.headers;
//     this.sendMessageHeaders = {
//       'Content-Type': 'application/json',
//     };
//     this.CONFIG_DATA = this._appConfig.CONFIG_DATA;
//   }


//   public getMobileAppUrls(data) {
//     var Headers = this.getMobileAppUrlheaders;
//     return this.http.post(this.CONFIG_DATA.SERVER_ROOT_URL + "buckets/AM_MobileApps/query", data, {
//       headers: Headers
//     }).map((res: Response) => {
//       return res;
//     });
//   };


//   public sendLink(data) {
//     var Headers = this.sendMessageHeaders;
//     return this.http.post(this.CONFIG_DATA.BROADCAST_URL, data, {
//       headers: Headers
//     }).map((res: Response) => {
//       return res;
//     });
//   };



// }
