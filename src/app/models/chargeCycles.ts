export class ChargeCyclesInfo {
     private cycleID: string;
     private peakChargeCurrent: string;
     private startTimeMillis: string;
     private endTimeMillis: string;
     private duration: any;
     private soc: string;
     private ahInTotal: string;

     constructor(cycleID?: string, peakChargeCurrent?: string, startTimeMillis?: string, endTimeMillis?: string, duration?: string, soc?: string, ahInTotal?: string) {
          this.cycleID = cycleID;
          this.peakChargeCurrent = peakChargeCurrent;
          this.startTimeMillis = startTimeMillis;
          this.endTimeMillis = endTimeMillis;
          this.duration = duration;
          this.soc = soc;
          this.ahInTotal = ahInTotal;
     }
}
