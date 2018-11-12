import { Session } from './../../models/Session';
import { AlertFilter } from '../../models/filter';
import { Alert } from '../../models/alert';
import { AlertsService } from './../../services/alerts/alerts.service';
import { replaceSpaceWithUnderScope, isValid } from './../../shared/utils/utils';
import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'am-alerts',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './alerts.component.html',
  providers: [AlertsService, DecimalPipe],
  styles: [`
   
      gm-style-iw {
       width: 20px;
       min-height: 50px;
       }
       .server-scrolling-demo {
     height: calc(100vh - 110px);
   }
   
   .server-scrolling-demo .progress-linear {
     position: fixed !important;
     bottom: 0px;
   }
    `]
})
export class AlertsComponent implements OnInit {
  private filter: AlertFilter;
  itemsPerPage = new FormControl('10');
  private rows: Array<Alert> = [];
  public loading = false;
  private search: string = '';
  private sortOrder: string = 'desc';
  private sortColumn: string = '_created';
  private token: string = '';

  private start: number = 0;
  private location_lat: number = 0;
  private location_lon: number = 0;
  private assetLocationName: string = '';
  private image: string = '';
  private render: boolean;
  private isLoading: boolean;
  private noRecords: boolean = false;

  readonly headerHeight = 50;
  readonly rowHeight = 50;
  // readonly pageLimit = 15;
  public page: object = {
    size: this.itemsPerPage.value,
    totalElements: 0,
    pageNumber: 0,
  };
  private nextPageKey: string = '200/';
  private activePage: number = 0;
  private session: Session;
  constructor(private decimalPipe: DecimalPipe, private http: HttpClient, private translate: TranslateService, private toastrService: ToastrService, private _alertsService: AlertsService, private el: ElementRef, private logger: NGXLogger) {
    this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
    console.log(this.session);
    this.token = this.session.token;;
    this.filter = this._alertsService.getAlertsFilterData();

  }

  ngOnInit() {
    this.loadAlertsData();
  }
  public loadAlertsData() {
    if (!this.noRecords) {
      this.isLoading = true;
      let nextPaginationKey = this.nextPageKey + this.activePage * this.page['size'];
      let data = {
        'order': { "dir": this.sortOrder, "column": this.sortColumn },
        "start": this.start,
        "length": this.page['size'],
        "userToken": this.token,
        "nextPaginationKey": nextPaginationKey,
        "filter": []
      };

      if (isValid(this.search)) {
        data.filter.push({
          key: 's_assetName',
          value: this.search.toLowerCase(),
          filterType: 'sw'
        });
      }

      if (isValid(this.filter.assetName)) {
        data.filter.push({
          key: 's_assetName',
          value: this.filter.assetName.toLowerCase(),
          filterType: 'eq'
        });
      }
      if (isValid(this.filter.sensorName)) {
        data.filter.push({
          key: 'label',
          value: this.filter.sensorName,
          filterType: 'eq'
        });
      }
      if (isValid(this.filter.assetLocation)) {
        data.filter.push({
          key: 'c_address',
          value: this.filter.assetLocation,
          filterType: 'eq'
        });
      }
      if (isValid(this.filter.assetAlert)) {
        data.filter.push({
          key: 'alert',
          value: this.filter.assetAlert,
          filterType: 'eq'
        });
      }
      this.logger.info("Alert Input Data " + JSON.stringify(data));
      // api call for get alerts data
      this.loading = true;
      this._alertsService.getAlerts(data).subscribe((result: any) => {
        this.loading = false;
        // this.logger.info('ALERTS', 'getAlerts', "results:" + JSON.stringify(result));
        // this.nextPageKey = result.returnedValue.data.nextPaginationKey;
        let alerts: any[] = result.returnedValue.data.records;
        let itemsTotal = result.returnedValue.data.recordsTotal;
        // if (!isValid(this.nextPageKey))
        //   this.noRecords = true;
        let alertsArray: any[] = [];
        alerts.forEach(data => {
          let jsonData: Alert = new Alert();
          console.log(data);
          data['assetStatus'] = data._customInfo.alertData.sensorColor;

          if (data['assetStatus'].toUpperCase() === "RED") {
            jsonData['sensorColor'] = "#ff0000";

          } else if (data['assetStatus'].toUpperCase() === "ORANGE") {

            jsonData['sensorColor'] = "#e24626";
          } else if (data['assetStatus'].toUpperCase() === "YELLOW") {

            jsonData['sensorColor'] = "#ff9900";
          } else if (data['assetStatus'].toUpperCase() === "GREEN") {

            jsonData['sensorColor'] = "green";
          }

          if (!isValid(data._customInfo.units)) {
            data._customInfo.units = "";
          }
          jsonData['assetName'] = data._customInfo.assetName;
          // jsonData['assetName'] = replaceSpaceWithUnderScope(jsonData['assetName'])
          jsonData['address'] = data._customInfo.c_address;
          jsonData['label'] = data._customInfo.label;
          if (data._customInfo.alertData.units == "mt") {
            data._customInfo.alertData.units = "km"
          }
          if (data._customInfo.alertData.internal_name == "Movement") {
            jsonData['reading'] = Math.round((data._customInfo.alertData.reading) / 100) / 10 + ' ' + data._customInfo.alertData.units
          } else {
            jsonData['reading'] = data._customInfo.alertData.reading + '' + data._customInfo.alertData.units
          }
          jsonData['alert'] = data._customInfo.alert;
          jsonData['_created'] = data._created;
          alertsArray.push(jsonData);
        });
        this.rows = alertsArray;
        console.log(this.rows);
        this.page['pageNumber'] = this.activePage;
        this.page['size'] = this.page['size'];
        this.page['totalElements'] = itemsTotal;
        this.rows.length = itemsTotal;
        // setTimeout(() => window.dispatchEvent(new Event('resize')));
        this.isLoading = false;
      }, err => this.loading = false);
    }
  }

  /**
** This function is used to filter alerts data when we click on filter.
*/
  public filterAlertsData() {

    this._alertsService.setAlertsFilter(this.filter);
    jQuery("#alertsFilter-modal").modal("hide");
    this.rows.splice(0, this.rows.length);
    //this.noRecords = false;
    this.start = 0;
    this.activePage = 0;
    this.loadAlertsData();
  }
  /**
  ** This function is used to reset filter alerts data when we click on reset.
  */
  public resetAlertFilter() {
    this.filter = new AlertFilter('', '', '', '');
    this._alertsService.setAlertsFilter(this.filter);
    this.rows.splice(0, this.rows.length);
    this.noRecords = false;
    this.loadAlertsData();
  };

  //for alert geo location
  // getAlertGeoLocation(data) {
  //   this.location_lat = data._customInfo.location.lat;
  //   this.location_lon = data._customInfo.location.lon;
  //   this.assetLocationName = data._customInfo.assetName;
  //   this.image = data.image;
  //   this.render = true;
  // }
  //Search based on asset name
  public updateFilter(event) {
    let val = event.target.value;
    // this.rows.splice(0, this.rows.length);
    //this.noRecords = false;
    this.start = 0;
    this.search = val;
    this.activePage = 0;
    this.loadAlertsData();
  }

  //No of rows for page pageLimit
  public pageLimit(num: any) {
    this.activePage = 0;
    this.page['size'] = (num);
    // this.rows.splice(0, this.rows.length);
    this.loadAlertsData();
  }

  // Pagination
  public setPage(event) {
    this.start = event.offset * 10;
    this.activePage = event.offset;
    // this.rows.splice(0, this.rows.length);
    this.loadAlertsData();
  }

  // Sorting columns
  public onSort(event) {
    this.activePage = 0;
    this.sortColumn = event.column.prop;
    this.sortOrder = event.newValue;
    this.start = 0;
    this.loadAlertsData();
  }
}