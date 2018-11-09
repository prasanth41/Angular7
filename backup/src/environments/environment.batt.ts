// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  brandName: "Asset Monitoring",
  app: {
    //staging assetmonitoringk
    // "id": "ahsvexc8vpqv",
    // "key": "0a6baa62083e4b638b345854c1861e78",
    id: "q5x0z50pn40p",
    key: "f8f8374367a24d30a795752060eb6a09",
    url: "https://api-staging-saus.internal.kii.com/api"
  },
  rules: {
    url: "https://accelerators.kiibeta.com/kie-drools-wb",
    package: "multiassetmonitoring",
    repo: "MultiAssetMonitoring"
  },
  kafkaUrl: "https://accelerators.kiibeta.com/batterymonitoring-service/app/assetmonitoring",
  // "serviceUrl": "https://test.kiibeta.com/assetmonitoring-service/app/assetmonitoring",
  googleMapKey: "AIzaSyCx_ZaqWDu6leZ7ffeIz5sG9qrN5s4KFF0",
  debugEnabled: false
};
