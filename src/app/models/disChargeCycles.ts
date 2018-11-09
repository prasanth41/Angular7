export class DischargeCyclesInfo {
     private cycleID: string;
     private peakLoadCurrent: string;
     private avgLoadCurrent: string;
     private startTimeMillis: string;
     private endTimeMillis: string;
     private duration: any;
     private soc: string;
     private ahOutTotal: string;

     constructor(cycleID?: string, peakLoadCurrent?: string, avgLoadCurrent?: string, startTimeMillis?: string, endTimeMillis?: string, duration?: string, soc?: string, ahOutTotal?: string) {
          this.cycleID = cycleID;
          this.peakLoadCurrent = peakLoadCurrent;
          this.avgLoadCurrent = avgLoadCurrent;
          this.startTimeMillis = startTimeMillis;
          this.endTimeMillis = endTimeMillis;
          this.duration = duration;
          this.soc = soc;
          this.ahOutTotal = ahOutTotal;
     }
}
