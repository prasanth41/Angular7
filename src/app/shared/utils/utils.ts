declare let Kii: any;
declare let KiiUser: any;
declare let KiiObject: any;
export const isNil = (value: any): value is (null | undefined) => {
  return value === null || typeof (value) === 'undefined';
};

export const isObject = (value: any): boolean => {
  return value && value.constructor === Object;
};

export const isBlank = (value: any): boolean => {
  return isNil(value) ||
    (isObject(value) && Object.keys(value).length === 0) ||
    value.toString().trim() === '';
};

export const isPresent = (value: any): boolean => {
  return !isBlank(value);
};
export const isValid = (value: any): boolean => {
  if (value !== "" && value !== null && value !== undefined && value !== "undefined") {
    return true;
  } else {
    return false;
  }
}

export const replaceSpaceWithUnderScope = (value: any) => {
  this.http.get('assets/config/mapping.json').subscribe(res => {
    let Keys = Object.keys(res);
    this.mappingsObject = res;
  });

  let upperCaseValue = value.replace(/ /g, "_").toUpperCase();
  if (this.mappingsObject.hasOwnProperty(upperCaseValue)) {
    value = this.mappingsObject[upperCaseValue];
  } else {
    value = value;
  }
  return value;
}
/**
** This function is used for uploading the images into cloud
*/
export const uploadImage = (customInfo, cb) => {
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
  KiiUser.authenticateWithToken(JSON.parse(sessionStorage.getItem('sessionInfo')).token).then(function (theUser) {
    // Instantiate a KiiObject.
    var object = KiiObject.objectWithURI(customInfo.objectUri);

    // Refresh the KiiObject to retrieve the latest data from Kii Cloud.
    object.refresh().then(function (theObject) {
      // Start uploading.
      return theObject.uploadBody(blob, {
        progress: function (oEvent) {
          if (oEvent.lengthComputable) {
            // Get the upload progress. You can update the progress bar with this function.
            var percentComplete = oEvent.loaded / oEvent.total * 100;
            console.log('COMMONUTILS', 'uploadImage', "Uploaded results:" + percentComplete + " %");
          }
        }
      });
    }
    ).then(function (theObject) {
      theObject.publishBody().then(function (params) {
        var theObject = params[0];
        theObject.set("c_image", params[1]);

        // console.log('COMMONUTILS', 'theObject', "theObject set:" + JSON.stringify(theObject));

        // theObject.save();

        theObject.save().then(
          function (theSavedObject) {
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
          function (error) {
            // do something with the error response
            var text = {};
            text['status'] = false;
            cb(text);
          }
        );

        // if (thisisValid(customInfo.table)) {
        //   customInfo.table.dtInstance.reloadData(null, false);
        // }
        // if (isValid(customInfo.profile)) {
        //   $rootScope.currentUser = customInfo.profile;
        //   $rootScope.userImage = params[1];
        //   var sessionInfo = JSON.parse($window.sessionStorage["sessionInfo"]);
        //   var userInfo = sessionInfo.session;
        //   Session.create(userInfo.token, customFields.profile, userInfo.userMail, userInfo.userRole, userInfo.tenantType, userInfo.tenantId, userInfo.tenantName, params[1], userInfo.expiresIn);
        //   sessionInfo['session'] = Session;
        //   $window.sessionStorage["sessionInfo"] = JSON.stringify(sessionInfo);
        //   toastNotifier.showSuccess($translate.instant('PROFILE.SUCCESS.UPDATION_SUCCESS'));
        // }
        // if (customInfo.profile !== "" && customInfo.profile !== null && customInfo.profile !== undefined && customInfo.profile !== "undefined") {
        //   var obj = {
        //     token: sessionStorage.getItem('_accessToken'),
        //     userName: customInfo.profile,
        //     userMail: JSON.parse(sessionStorage.getItem('sessionInfo')).userMail,
        //     userImage: params[1],
        //     userRole: JSON.parse(sessionStorage.getItem('sessionInfo')).userRole,
        //     tenantType: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantType,
        //     tenantId: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantId,
        //     tenantName: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantName
        //   }
        //   sessionStorage.setItem('sessionInfo', JSON.stringify(obj));
        //   console.info('COMMONUTILS', 'uploadImage if', "Uploaded results1265:");
        // }

      }
      ).catch(function (error) {
        var theObject = error.target;
        var errorString = error.message;
        console.error('COMMONUTILS', 'uploadImage', "1:" + errorString);
      });
    }).catch(function (error) {
      var theObject = error.target;
      var errorString = error.message;
      console.error('COMMONUTILS', 'uploadImage', "2:" + errorString);
    });
  }).catch(function (error) {
    var theUser = error.target;
    var errorString = error.message;
    console.error('COMMONUTILS', 'uploadImage', "3:" + errorString);
  });

  // return true;
}