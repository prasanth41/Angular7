export class Alert {
     address: string;
     alert: string;
     assetName: string;
     deviceName: string;
     image: string;
     label: string;
     reading: string;
     sensorColor: string;
     _created: number;

     constructor();
     constructor(address?: string, alert?: string, assetName?: string, deviceName?: string, image?: string, label?: string, reading?: string, sensorColor?: string, _created?: number) {
          this.address = address || '';
          this.alert = alert || '';
          this.assetName = assetName || '';
          this.deviceName = deviceName || '';
          this.image = image || '';
          this.label = label || '';
          this.reading = reading || '';
          this.sensorColor = sensorColor || '';
          this._created = _created || 0;
     }
}
