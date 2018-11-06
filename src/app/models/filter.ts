export class AlertFilter {
     assetName: string;
     sensorName: string;
     assetLocation: string;
     assetAlert: string;

     constructor(assetName?: string, sensorName?: string, assetLocation?: string, assetAlert?: string) {
          this.assetName = assetName;
          this.sensorName = sensorName;
          this.assetLocation = assetLocation;
          this.assetAlert = assetAlert;
     }
}
