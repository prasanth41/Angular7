export class AnalyticsFilter {
  from: Date;
  to: Date;
  tenant: string;

  constructor(from?: Date, to?: Date, tenant?: string) {
    this.from = from;
    this.to = to;
    this.tenant = tenant;
  }
}
