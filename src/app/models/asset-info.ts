export class AssetInfo {
     private deviceId: string;
     private label: string;
     private deviceName: string;
     private modified: string;
     private internalName: string;
     private sensorColor: string;
     private image: string;
     private statusClass: string;
     private value: string;

     constructor(deviceId?: string, label?: string, deviceName?: string, modified?: string, internalName?: string, sensorColor?: string, image?: string, statusClass?: string, value?: string) {
          this.deviceId = deviceId;
          this.label = label;
          this.deviceName = deviceName;
          this.modified = modified;
          this.internalName = internalName;
          this.sensorColor = sensorColor;
          this.image = image;
          this.statusClass = statusClass;
          this.value = value;
     }
}
