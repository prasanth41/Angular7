export class AnalyticsFilter {
     from: Date;
     to: Date;
     tenant: string;
     selectedName: string;
     selectedAsset: string;
     parameter: string;

     constructor(from?: Date, to?: Date, tenant?: string, selectedName?: string, selectedAsset?: string, parameter?: string) {
          this.from = from;
          this.to = to;
          this.tenant = tenant;
          this.selectedName = selectedName;
          this.selectedAsset = selectedAsset;
          this.parameter = parameter;
     }
}
