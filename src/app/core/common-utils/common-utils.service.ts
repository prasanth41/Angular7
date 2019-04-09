/**
 * @Author: Subhash
 * @Date:   2018-12-20T12:15:27+05:30
 * @Project: Tower Monitoring
 * @Last modified by:   Subhash
 * @Last modified time: 2019-01-08T16:55:19+05:30
 * @Copyright: 2018, Kii Corporation www.kii.com
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

import { AppConfig } from "../../app.config";

declare let Kii: any;
declare let KiiUser: any;
declare let KiiObject: any;
@Injectable()
export class CommonUtils {

  headers: any;
  CONFIG_DATA: any = {};
  _timezone: any = null;
  _timeZoneAbbr: any
  mappingsObject = {};

  constructor(private http: HttpClient, private _appConfig: AppConfig, private logger: NGXLogger) {
    this.headers = this._appConfig.headers;
    this.CONFIG_DATA = this._appConfig.CONFIG_DATA;
    this.http.get('assets/config/mapping.json').subscribe(res => {
      let Keys = Object.keys(res);
      this.mappingsObject = res;
    });
  }

  /**
  ** This function is used for checking the value is valid or not.
  */
  public isValid(value) {
    if (value !== "" && value !== null && value !== undefined && value !== "undefined") {
      return true;
    } else {
      return false;
    }
  }

  /**
  ** This function is used for replace the space with underscore and transform toUppercase for checking site name in mappings json
  */
  public replaceSpaceWithUnderscope(value) {
    let upperCaseValue = value.replace(/ /g, "_").toUpperCase();
    if (this.mappingsObject.hasOwnProperty(upperCaseValue)) {
      value = this.mappingsObject[upperCaseValue];
    } else {
      value = value;
    }
    return value;
  }
  /**
  ** This function is used to get local time zome
  */
  public getLocalTimeZone(dateInput: any) {
    if (this._timezone) return this._timezone;

    var dateObject = dateInput || new Date(),
      dateString = dateObject + ""

    this._timeZoneAbbr = (
      dateString.match(/\(([^\)]+)\)$/) ||
      dateString.match(/([A-Z]+) [\d]{4}$/)
    );

    if (this._timeZoneAbbr) {
      this._timeZoneAbbr = this._timeZoneAbbr[1].match(/[A-Z]/g).join("");
    }

    if (!this._timeZoneAbbr && /(GMT\W*\d{4})/.test(dateString)) {
      return RegExp.$1;
    }

    this._timezone = this._timeZoneAbbr;
    return this._timeZoneAbbr;
  }
  /**
  ** This function is used for uploading the images into cloud
  */
  uploadImage(customInfo, cb) {
    let base64 = customInfo.imageDataUri;

    let byteString = atob(base64.split(',')[1]);

    // separate out the mime component
    let contentType = base64.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let byteNumbers = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
    let byteArray = new DataView(arrayBuffer);

    let blob = new Blob([byteArray], { type: contentType });

    // let kii = Kii.create();
    Kii.initializeWithSite(this.CONFIG_DATA.APP_ID, this.CONFIG_DATA.APP_KEY, this.CONFIG_DATA.APP_URL);
    KiiUser.authenticateWithToken(JSON.parse(sessionStorage.getItem('sessionInfo')).token).then(function(theUser) {
      // Instantiate a KiiObject.
      var object = KiiObject.objectWithURI(customInfo.objectUri);

      // Refresh the KiiObject to retrieve the latest data from Kii Cloud.
      object.refresh().then(function(theObject) {
        // Start uploading.
        return theObject.uploadBody(blob, {
          progress: function(oEvent) {
            if (oEvent.lengthComputable) {
              // Get the upload progress. You can update the progress bar with this function.
              var percentComplete = oEvent.loaded / oEvent.total * 100;
              console.log('COMMONUTILS', 'uploadImage', "Uploaded results:" + percentComplete + " %");
            }
          }
        });
      }
      ).then(function(theObject) {
        theObject.publishBody().then(function(params) {
          var theObject = params[0];
          theObject.set("c_image", params[1]);

          // console.log('COMMONUTILS', 'theObject', "theObject set:" + JSON.stringify(theObject));

          // theObject.save();

          theObject.save().then(
            function(theSavedObject) {
              // do something with the saved object
              console.log('COMMONUTILS', 'theObject', "theSavedObject :" + JSON.stringify(theSavedObject));
              if (customInfo.profile !== "" && customInfo.profile !== null && customInfo.profile !== undefined && customInfo.profile !== "undefined") {
                var obj = {
                  token: sessionStorage.getItem('_accessToken'),
                  userName: customInfo.profile,
                  userMail: JSON.parse(sessionStorage.getItem('sessionInfo')).userMail,
                  userImage: params[1],
                  userRole: JSON.parse(sessionStorage.getItem('sessionInfo')).userRole,
                  tenantType: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantType,
                  tenantId: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantId,
                  tenantName: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantName
                }
                sessionStorage.setItem('sessionInfo', JSON.stringify(obj));
                // console.info('COMMONUTILS', 'uploadImage if', "Uploaded results1265:");

                var text = {};
                text['status'] = true;
                cb(text);
              } else {
                var text = {};
                text['status'] = true;
                cb(text);
              }

            },
            function(error) {
              // do something with the error response
              var text = {};
              text['status'] = false;
              cb(text);
            }
          );

                }
        ).catch(function(error) {
          var theObject = error.target;
          var errorString = error.message;
          console.error('COMMONUTILS', 'uploadImage', "1:" + errorString);
        });
      }).catch(function(error) {
        var theObject = error.target;
        var errorString = error.message;
        console.error('COMMONUTILS', 'uploadImage', "2:" + errorString);
      });
    }).catch(function(error) {
      var theUser = error.target;
      var errorString = error.message;
      console.error('COMMONUTILS', 'uploadImage', "3:" + errorString);
    });
  }

}
