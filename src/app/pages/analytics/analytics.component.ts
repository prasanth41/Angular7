import { Session } from './../../models/Session';
import { replaceSpaceWithUnderScope, isValid } from './../../shared/utils/utils';
import { AnalyticsFilter } from './../../models/analytics-filter';
import { DashboardService } from './../../services/dashboard/dashboard.service';
import { AnalyticsService } from './../../services/analytics/analytics.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Chart } from 'angular-highcharts';
import { orderBy } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { format } from 'date-fns';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Pipe({
     name: 'orderBy'
})
@Component({
     selector: 'az-analytics',
     providers: [AnalyticsService, DatePipe, DashboardService],
     encapsulation: ViewEncapsulation.None,
     templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements AfterViewInit, PipeTransform {
     private sensorIssues: any = {};
     private assetIssues: any = {};
     private token = '';
     private tenantType: string = '';
     private tenantId: string = '';
     private tenantIdSelected = '';
     private fromDate = '';
     private toDate = '';
     private tenant = '';
     private filter: any;
     private filterData: AnalyticsFilter;
     private showTenant: boolean;
     private tenants: any = [];
     transform = orderBy;
     formatDate = format;
     private bsRangeValue;
     private singleSelect;
     private sensorsByIssues: string;
     private issuesCountLabel: string;
     private issuesLabel: string;
     private assetsWithIssues: string;
     private assetsCount: string;
     private assetsLable: string;
     private noData: string;
     public menuItemsArray: any = ['printChart',
          'downloadPNG',
          'downloadPDF',
          'downloadXLS',
          'downloadCSV'];
     public seperator: boolean = false;
     private assetInfoMarkerID = {};
     private sites: any = [];
     private selectedOptions: any = [];
     private options: any = [];
     private session: Session;
     public config = {
          displayKey: "name", //if objects array passed which key to be displayed defaults to description
          search: true,
     };
     public bsConfig: Partial<BsDatepickerConfig>;

     constructor(private datePipe: DatePipe, private toastrService: ToastrService, private http: HttpClient, private translate: TranslateService, private _analyticService: AnalyticsService, private _dashboardService: DashboardService, private logger: NGXLogger) {
          this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
          this.token = this.session.token;
          this.tenantType = this.session.tenantType;
          this.tenantId = this.session.tenantId;
          if (this.tenantType !== 'Tenant') {
               this.tenantIdSelected = 'all';
               this.showTenant = true;

          } else {
               this.showTenant = false;
               this.tenantIdSelected = this.tenantId;
          }

          this.fromDate = this._analyticService.getAnalyticsFilterData().from;
          this.toDate = this._analyticService.getAnalyticsFilterData().to;
          this.filterData = this._analyticService.getAnalyticsFilterData();
          if (this._analyticService.getAnalyticsFilterData().tenant !== undefined) {
               this.filter = {
                    from: this.formatDate(this.filterData.from, 'YYYY-MM-DD'),
                    to: this.formatDate(this.filterData.to, 'YYYY-MM-DD'),
                    tenant: this.filterData.tenant,
                    selectedName: this.filterData.selectedName,
                    selectedAsset: this.filterData.selectedAsset,
                    parameter: this.filterData.parameter
               };
          } else {
               this.filter = {
                    from: this.formatDate(this.filterData.from, 'YYYY-MM-DD'),
                    to: this.formatDate(this.filterData.to, 'YYYY-MM-DD'),
                    tenant: 'all',
                    selectedName: this.filterData.selectedName,
                    selectedAsset: this.filterData.selectedAsset,
                    parameter: this.filterData.parameter
               };
          }
          this.bsRangeValue = [new Date(this.filterData.from), new Date(this.filterData.to)];
          this.selectedOptions = [{
               asset_id: this.filterData.selectedName,
               name: this.filterData.selectedAsset,
          }];

          if (isValid((this.filterData.selectedName))) {
               this.assetInfoMarkerID = this.filterData.selectedName;
          } else {
               this.assetInfoMarkerID = "";
               // this.translate.get('No Battery is Selected').subscribe((res: string) => {
               //   this.toastrService.warning(res, '');
               // });
          }

          this.bsConfig = Object.assign({}, {
               showWeekNumbers: false,
               maxDate: new Date()
          }
          );
     }

     ngOnInit() {
          let data = {
               "filter": [],
               "userToken": this.session.token,
          }
          if (this.tenantType !== 'Tenant') {
               this._dashboardService.getTenants(data).subscribe((result: any) => {
                    this.tenants = result.returnedValue.data.records;
               });
          }
     }
     ngAfterViewInit() {
          if (this.tenantType !== 'Tenant') {
               if (this.filter.tenant) {
                    this.tenantIdSelected = this.filter.tenant;
               } else {
                    this.tenantIdSelected = 'all';
               }
          } else {
               this.tenantIdSelected = this.tenantId;
          }
          var sitesArray = [];
          this.getSites();
          //this.getAssetIssuesChart(input, this.tenantIdSelected)
     };
     /**
  **This function is used to set global tenant when we onChange tenant
  */
     onChangeTenant(tenantId) {
          if (this.tenantType !== 'Tenant') {
               this.tenantIdSelected = this.filter.tenant;
          } else {
               this.tenantIdSelected = this.tenantId;
          }
          this.getSites();
     }
     /**
  **This function is used to get the sites
  */
     getSites() {
          let data = {
               "filter": [],
               "userToken": this.token,
               "length": 199
          }

          this._dashboardService.getAssetsService(this.tenantIdSelected, data).subscribe((result: any) => {
               this.logger.info('DASHBOARD', 'Get Assets' + JSON.stringify(result));
               var assetsData = result.data.assets;
               // for (var i = 0; i < assetsData.length; i++) {
               //      assetsData[i]['name'] = replaceSpaceWithUnderScope(assetsData[i].name)
               // }
               this.sites = assetsData;
               console.log(this.sites);
               if (isValid(this.filter.selectedName)) {
                    this.filter.selectedName = this.filter.selectedName;
                    this.filter.selectedAsset = this.filter.selectedAsset;
                    // this.filter.selectedAsset = replaceSpaceWithUnderScope(this.filter.selectedAsset);
                    this.setSelectedId();
                    this.assetInfoMarkerID = this.filter.selectedId;
                    if (this.sites.length == 0) {
                         this.selectedOptions = [];
                         this.translate.get('No Battery is Selected').subscribe((res: string) => {
                              this.toastrService.warning(res, '');
                         });
                    } else {
                         this.selectedOptions = [{
                              asset_id: this.filter.selectedName,
                              name: this.filter.selectedAsset,
                         }];
                    }
               } else {
                    if (this.sites.length != 0) {
                         this.filter.selectedName = this.sites[0].asset_id;
                         this.filter.selectedAsset = this.sites[0].name;
                         // this.filter.selectedAsset = replaceSpaceWithUnderScope(this.filter.selectedAsset)
                         this.assetInfoMarkerID = this.filter.selectedName;
                         this.selectedOptions = [{
                              asset_id: this.filter.selectedName,
                              name: this.filter.selectedAsset,
                         }];
                         this._analyticService.setAnalyticsFilter(this.filter);
                    } else {
                         this.filter.selectedName = "";
                         this.filter.selectedAsset = "";
                         this.selectedOptions = [];
                         this.translate.get('No Battery is Selected').subscribe((res: string) => {
                              this.toastrService.warning(res, '');
                         });
                         this.assetInfoMarkerID = this.filter.selectedName;
                         this._analyticService.setAnalyticsFilter(this.filter);
                    }
               }
               this.config = {
                    displayKey: "name", //if objects array passed which key to be displayed defaults to description
                    search: true,
               };
               let input = {
                    fromDate: this.formatDate(new Date(this.filterData.from), 'YYYY-MM-DD'),
                    toDate: this.formatDate(new Date(this.filterData.to), 'YYYY-MM-DD'),
                    userToken: JSON.parse(sessionStorage.getItem('sessionInfo')).token,
               }
               this.getTemperatureInfoChart(input, this.tenantIdSelected, this.assetInfoMarkerID)

          },
               function (error) {
                    //     if (error.status === CONFIG_DATA.SERVER_RESPONSE.FAIL_CODE && error.data.errorCode.toUpperCase() === CONFIG_DATA.WRONG_TOKEN) {
                    //       utilityFunctions.sessionExpired($translate.instant('Menu.SESSION_EXPIRED'));
                    //     } else {
                    //       toastNotifier.showError($translate.instant('Menu.SERVER_NOT_FOUND'));
                    //     }
               });
     }
     /**
  **This function is used to set site  when we Change the site name
  */
     changeValue($event: any) {
          if (isValid($event.value)) {
               this.filter.selectedName = $event.value[0].asset_id;
               this.filter.selectedAsset = $event.value[0].name;
               this.selectedOptions = [{
                    asset_id: this.filter.selectedName,
                    name: this.filter.selectedAsset,
               }];
               this.assetInfoMarkerID = this.filter.selectedName;
          } else {
               this.selectedOptions = [{
                    asset_id: "",
                    name: "",
               }];
          }
     }

     /**
     **This function is used to display data when we open the filter popup
     */
     public filterAnalyticsPopup() {
          this.getSites();
          this.filter.tenant = this.filter.tenant;
          this.filter.selectedName = this.filter.selectedName;
          this.filter.selectedAsset = this.filter.selectedAsset;
          this.filter.parameter = this.filter.parameter;
          this.selectedOptions = [{
               asset_id: this.filter.selectedName,
               name: this.filter.selectedAsset,
          }];
          this.setSelectedId();
          this.assetInfoMarkerID = this.filter.selectedId;
     }

     setSelectedId() {

          this.sites.forEach((data) => {
               if (data.name == this.filter.selectedName) {
                    this.filter.selectedId = data.asset_id;
                    // this.filter.selectedName= this.filter.selectedId 
               }
          })
     }
     /**
     **This function is used to display filtered analytics data
     */
     public filterAnalyticsData() {
          this.filter.from = new Date(this.bsRangeValue[0].getFullYear(), (this.bsRangeValue[0].getMonth()), (this.bsRangeValue[0].getDate()));
          this.filter.to = new Date(this.bsRangeValue[1].getFullYear(), (this.bsRangeValue[1].getMonth()), (this.bsRangeValue[1].getDate()));
          if (this.tenantType !== 'Tenant') {
               if (this.filter.tenant) {
                    this.tenantIdSelected = this.filter.tenant;
               } else {
                    this.tenantIdSelected = 'all';
               }
          } else {
               this.tenantIdSelected = this.tenantId;
          }
          if (this.filter.from > this.filter.to) {
               this.translate.get('INFO.FROM_DATE_SHOULD_LESS_THAN_DATE').subscribe((res: string) => {
                    this.toastrService.warning(res, '');
               });
               return false;
          } else {
               this._analyticService.setAnalyticsFilter(this.filter);
               this.filter = {
                    from: this.formatDate(new Date(this.filter.from), 'YYYY-MM-DD'),
                    to: this.formatDate(new Date(this.filter.to), 'YYYY-MM-DD'),
                    tenant: this.filter.tenant,
                    selectedName: this.filter.selectedName,
                    selectedAsset: this.filter.selectedAsset,
                    parameter: this.filter.parameter
               };
               this.fromDate = this.filter.from;
               this.toDate = this.filter.to;
               let inputData = {
                    fromDate: this.filter.from,
                    toDate: this.filter.to,
                    userToken: JSON.parse(sessionStorage.getItem('sessionInfo')).token,
               }
               // this.assetInfoMarkerID = this.filter.selectedName;
               if (isValid((this.filter.selectedName))) {
                    this.setSelectedId();
                    this.assetInfoMarkerID = this.filter.selectedId;
               } else {
                    this.assetInfoMarkerID = "";
                    // this.translate.get('No Battery is Selected').subscribe((res: string) => {
                    //   this.toastrService.warning(res, '');
                    // });
               }
               this.getTemperatureInfoChart(inputData, this.tenantIdSelected, this.assetInfoMarkerID);
               jQuery("#filter-analytics").modal("hide");
          }
          this.filter.selectedAsset = this.filter.selectedName
          this._analyticService.setAnalyticsFilter(this.filter);

     }


     /**
     **This function is used for closing the filter popup
     */
     public filterCancel() {
          this.filterData = this._analyticService.getAnalyticsFilterData();
          this.filter = this.filterData;
          jQuery("#filter-analytics").modal("hide");
     }

     /**
     **This function is used for reset filter in analytics
     */
     public resetAnalyticsFilter() {
          let today = new Date();
          let firstday = new Date(today.setDate(today.getDate()));
          let lastday = new Date(today.setDate(today.getDate()));
          this.bsRangeValue = [new Date(firstday), new Date(lastday)];
          this.filter = {
               from: this.formatDate(new Date(firstday), 'YYYY-MM-DD'),
               to: this.formatDate(new Date(lastday), 'YYYY-MM-DD'),
               tenant: 'All',
               selectedName: this.filter.selectedName,
               selectedAsset: this.filter.selectedAsset,
               parameter: 'Temperature'
          };
          if (this.tenantType !== 'Tenant') {
               this.tenantIdSelected = 'all';
          } else {
               this.tenantIdSelected = this.tenantId;
          }
          this.fromDate = this.filter.from;
          this.toDate = this.filter.to;
          let input = {
               fromDate: this.filter.from,
               toDate: this.filter.to,
               userToken: JSON.parse(sessionStorage.getItem('sessionInfo')).token,
          }
          if (isValid((this.filter.selectedName))) {
               this.setSelectedId();
               this.assetInfoMarkerID = this.filter.selectedId;
          } else {
               this.assetInfoMarkerID = "";
               // this.translate.get('No Battery is Selected').subscribe((res: string) => {
               //   this.toastrService.warning(res, '');
               // });
          }
          if (this.sites.length != 0) {
               this.filter.selectedName = this.sites[0].asset_id;
               this.assetInfoMarkerID = this.filter.selectedName;
               this.filter.selectedAsset = this.sites[0].name;
          }
          this._analyticService.setAnalyticsFilter(this.filter);
          this.getTemperatureInfoChart(input, this.tenantIdSelected, this.assetInfoMarkerID);
     };

     /**
     **This function is used to get temperature information and display data in chart
     */
     public getTemperatureInfoChart(data, tenantId, assetInfoMarkerID) {
          this._analyticService.getTemperatureInfo(data, tenantId, assetInfoMarkerID).subscribe((result: any) => {
               this.logger.info('ANALYTICS', 'GetSensorIssuesChart', "results:" + JSON.stringify(result));
               this.translate.get('ANALYTICS.TITLE.SENSORS_BY_ISSUES').subscribe((res: string) => {
                    this.sensorsByIssues = res;
               });
               this.translate.get('ANALYTICS.TITLE.ISSUES_COUNT').subscribe((res: string) => {
                    this.issuesCountLabel = res;
               });
               this.translate.get('LABELS.ISSUES').subscribe((res: string) => {
                    this.issuesLabel = res;
               });
               this.translate.get('INFO.NO_DATA_AVAILABLE').subscribe((res: string) => {
                    this.noData = res;
               });

               let records: any[] = result.data;
               let xaxisData: any[] = [];
               let seriesData: any[] = [];
               if (records.length === 0) {
                    xaxisData.push(this.noData);
                    seriesData.push('0');
               } else {
                    records.forEach(data => {
                         xaxisData.push(data.time);
                         seriesData.push(data.value);
                    });
               }
               this.sensorIssues = new Chart({
                    //exporting: { enabled: true },
                    lang: {
                         contextButtonTitle: 'Export',
                    },
                    exporting: {
                         filename: "Temperature " + "(" + this.filter.from + "-" + this.filter.to + "-" + ")",
                         buttons: {
                              contextButton: {
                                   // symbol: 'printIcon',
                                   enabled: true,
                                   theme: {
                                        // fill: '#ddd',
                                        //stroke: '#888',
                                        states: {
                                             hover: {
                                                  fill: '#fcc',
                                                  // stroke: '#f00',
                                             },
                                             select: {
                                                  fill: '#cfc',
                                                  //stroke: '#0f0'
                                             }
                                        }
                                   },
                                   menuItems: this.menuItemsArray,
                              },
                         }
                    },
                    tooltip: {
                         formatter: function () {
                              return this.x + '<br> Reading:' + this.y;
                         }
                    },
                    credits: {
                         enabled: false
                    },
                    title: {
                         text: "Temperature"
                    },
                    xAxis: {
                         categories: xaxisData
                    },
                    yAxis: {
                         title: {
                              text: "Temperature"
                         },
                    },
                    series: [{
                         name: "Duration",
                         data: seriesData,
                         type: 'spline',
                    }]
               });
          }
          );
     }

}