// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  brandName: "Battery Monitoring",
  app: {

    //  Battery Monitoring Accelerator
    // id: "q5x0z50pn40p",
    // key: "f8f8374367a24d30a795752060eb6a09",
    //  Battery Monitoring
    //id: "kyfauzhpaj3y",
  //  key: "5954f0c57c1c49d980bee2cda3f99bb1",
    // new test
     id: "isal37r1nd3r",
     key: "573279fc3b194ff5bec91d8161ea7bcd",
    url: "https://api-staging-saus.internal.kii.com/api"
  },
  "rules": {
    "url": "//test.kiibeta.com",
    "application": "kie-drools-wb",
    "repository": "batterymonitoring",
    "project": "batterymonitoring",
    "package": "batterymonitoring",
    "service": "batterymonitoring-rulesservice"
  },
//  kafkaUrl: "http://183.82.9.54/batterymonitoring-service/app/assetmonitoring",
   kafkaUrl: "https://test.kiibeta.com/bms-service/app/assetmonitoring",
  // kafkaUrl: "http://183.82.9.54/batterymonitoring-service/app/assetmonitoring",
  // "serviceUrl": "https://test.kiibeta.com/assetmonitoring-service/app/assetmonitoring",
  googleMapKey: "AIzaSyCx_ZaqWDu6leZ7ffeIz5sG9qrN5s4KFF0",
  debugEnabled: true
};
