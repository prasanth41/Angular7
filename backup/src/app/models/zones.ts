export class Zones {
     private c_name: string;
     private c_id: string;
     private assets_Count: string;
     private technicians_count: string;
     private observers_count: string;

     constructor(c_name: string, c_id: string, assets_Count: string, technicians_count: string, observers_count: string) {
          this.c_name = c_name;
          this.c_id = c_id;
          this.assets_Count = assets_Count;
          this.technicians_count = technicians_count;
          this.observers_count = observers_count;
     }
}
