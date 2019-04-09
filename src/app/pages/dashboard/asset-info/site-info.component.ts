import { AssetInfo } from './../../../models/asset-info';
import { DischargeCyclesInfo } from './../../../models/disChargeCycles';
import { ChargeCyclesInfo } from './../../../models/chargeCycles';
import { isValid, replaceSpaceWithUnderScope } from './../../../shared/utils/utils';
import { SiteInfoService } from './../../../services/dashboard/site-info/site-info.service';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Chart } from 'angular-highcharts';
import * as moment from 'moment-timezone';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { Session } from '../../../models/Session';
@Pipe({
  name: 'dateFormatPipe',
})
@Component({
  selector: 'az-assetInfo',
  encapsulation: ViewEncapsulation.None,
  providers: [SiteInfoService, DashboardService, DatePipe, DecimalPipe],
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.scss']
})
export class SiteInfoComponent implements OnInit, OnDestroy {
  assetInfoForm: FormGroup;
  downloadExcelInfoForm: FormGroup;
  private rowsForChargeCycles: Array<ChargeCyclesInfo> = [];
  private rowsFordisChargeCycles: Array<DischargeCyclesInfo> = [];
  private router: Router;
  private rows1: Array<AssetInfo> = [];
  private row1 = [];
  private row2 = [];
  private row3 = [];
  private row4 = [];
  private rows: any[] = [];
  private weakRow1 = [];
  private weakRow2 = [];
  private weakRow3 = [];
  private weakRow4 = [];
  sensorReadingsGraph: any = {};
  itemsPerPage = new FormControl('200');
  public page = {
    size: this.itemsPerPage.value,
    totalElements: 0,
    pageNumber: 0,
  };

  private nextPageKey: string = '200/';
  private activePage: number = 0;
  private start: number = 0;
  private search: string = "";
  private sortOrder: string = "asc";
  private sortColumn: string = "label";
  private sortColumnForDisCharged: string = "cycleID";
  private sortColumnForCharged: string = "cycleID";
  private sortOrderForCharging_Discharging = "desc"
  private token: string = "";
  private assetAddress: string = "";
  private assetId: string = "";
  private assetName: string = "";
  private healthState: string = "";
  private healthStateColor: string = "";
  private currentState: string = "";
  private currentStateColor: string = "";
  private millisecondsDateFormat;
  private cycleDuration;
  private installationDate: string = "";
  private reportingTime: string = "";
  private weakCellReportingTime: string = "";
  private batteryCapacity: number;
  private batteryCapacityColor: string = "";
  private batteryBackupTime: string = "";
  private measuredAhCapacity: string = "";
  private measuredAhCapacityColor: string = "";
  private totalVoltage: string = "";
  private socPercentage: string = "";
  private ahOut: string = "";
  private pcv: string = "";
  private peakLoadCurrent: string = "";
  private avgLoadCurrent: string = "";
  private dischargeCyclesCount: string = "";
  private cumulativeAhOut: string = "";
  private voltage: string = "";
  private temperature: string = "";
  private originalVoltage: string = "";
  private OriginalAhCapacity: string = "";
  private value: string = "";
  private label: string = "";
  private status: string = "";
  private tenantName: string = "";
  private zoneName: string = "";
  private assetInfoMarkerID = {};
  private labelName: string;
  private date = "";
  private daterange;
  private from = "";
  private to = "";
  private order: string;
  private ascending: boolean;
  private paginationKey;
  // It's containing Trend Graph paginationKey prev Key Flag.
  private prevKeyFlag = false;
  // It's containing Trend Graph paginationKey next Key Flag.
  private nextKeyFlag = false;
  // It's containing paging Data.
  private pagingData = {
    countPrev: 0,
    prevKey: "",
    nextKey: ""
  };
  private trend = {
    fromDate: new Date(),
    toDate: new Date(),
    length: '10'
  };
  private deviceReadingsArray: Array<AssetInfo> = [];
  private customReadingsArray: any[] = [];
  private customReadingsArrayTemperature: any[] = [];
  private data;
  private tenantId: string;
  private deviceId: string;
  public assetChartsData: any[] = [];
  // private session: any = {};
  showChart;
  private showTenant: boolean;
  private showMaster: boolean;
  private timer: any;
  private chart: Chart;
  private chart1: Chart;
  private chart2: Chart;
  private liveChartIntervals: any = [];
  private noData: string;
  private dataList = [];
  private weakCellsCount: number;
  private currentAddress: string = "";
  private movedAddress: string = "";
  private distance: number
  private weakCellCountColor: string;
  private self = this;
  public menuItemsArray: any = ['printChart',
    'downloadPNG',
    'downloadPDF',
    'downloadXLS',
    'downloadCSV'];
  AHOUTChartGraph: any = {};
  VoltageChartGraph: any = {};
  private chargeTypeName;
  private tenantIdSelected;
  private reportedTime;
  private healthrow1 = [];
  private healthrow2 = [];
  private healthrow3 = [];
  private healthrow4 = [];
  private healthbatteryBank: string = "";
  private voltageColor = "";
  private socColor = "";
  private temperatureColor = "";
  private health_batteryReportedTime;
  private showHealthCells: boolean = true;
  private showtheftalert: boolean = false;
  private socReading = "";
  private temperatureReading = "";
  private badcellPostfixNo = [];
  private badcellPostfixNo2 = [];
  private showbadcells: boolean = false;
  private session: Session
  constructor(private decimalPipe: DecimalPipe, private datePipe: DatePipe, router: Router, private http: HttpClient, private translate: TranslateService, private formBuilder: FormBuilder, private _dashboardService: DashboardService, private _siteInfoService: SiteInfoService, public toastrService: ToastrService, private logger: NGXLogger) {
    this.router = router;
    if (!isValid(JSON.parse(sessionStorage.getItem('assetInfoMarker'))))
      this.router.navigate(['/pages/dashboard']);
    this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
    if (this.session.tenantType !== 'Tenant') {
      this.tenantIdSelected = 'all';
    } else {
      this.tenantIdSelected = this.session.tenantId;
    }
    this.assetInfoMarkerID = JSON.parse(sessionStorage.getItem('assetInfoMarker')).asset_id;
    let today = new Date();
    let day = '' + (today.getDate());
    let month = '' + (today.getMonth() + 1); //January is 0!
    let yyyy = today.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    this.date = yyyy + '/' + month + '/' + day;
    this.from = this.date;
    this.to = this.date;
    this.daterange = [new Date(this.from), new Date(this.to)];
    // filter modal popup
    this.assetInfoForm = this.formBuilder.group({
      bsRangeValue: [this.daterange, '']
    }, {})

    this.downloadExcelInfoForm = this.formBuilder.group({
      bsRangeValue: [this.daterange, '']
    }, {})
    this.loadData();

  }
  ngOnInit() {
    if (this.session.tenantType === "Master") {
      this.showTenant = false;
      this.showMaster = true;
    } else if (this.session.tenantType === "Tenant") {
      this.showTenant = true;
      this.showMaster = false;
    }
    this.token = this.session.token;
    let tenant = JSON.parse(sessionStorage.getItem('assetInfoMarker')).tenat_admin_group_id.split('_');
    this.tenantId = tenant[0];
    this.ahOutChart();
    this.tempChart();
    this.voltageChart();
  }
  /**
** This function is used to get batteries health Info
*/
  getHealthStateInfoData() {
    this.badcellPostfixNo = [];
    this.badcellPostfixNo2 = [];
    var input = {
      userToken: this.token
    }
    var assetId = JSON.parse(sessionStorage.getItem('assetInfoMarker')).asset_id;
    let cellArray = [];
    let splitdata;
    this._dashboardService.getHealthStateData(this.tenantIdSelected, assetId, input).subscribe((result: any) => {
      this.logger.info('DASHBOARD', 'getBatteryHealthInfo', "results:" + JSON.stringify(result));
      //let cellReadingsArray: any[] = result.data.cells;
      this.health_batteryReportedTime = result.data.statusUpdatedMillis;
      this.voltageColor = this.getHealthStatusColors(result.data.voltageStatus);
      this.socColor = this.getHealthStatusColors(result.data.socStatus);
      this.temperatureColor = this.getHealthStatusColors(result.data.temperatureStatus);
      cellArray = result.data.cells;
      console.log(cellArray);
      cellArray.forEach((data) => {
        if (data.status.toUpperCase() !== "GOOD") {
          splitdata = data.sensorId.split("ll");
          this.badcellPostfixNo.push(splitdata[1]);
          console.log(this.badcellPostfixNo);
        }

      });
      for (let i = 0; i < 3; i++) {
        if (isValid(this.badcellPostfixNo[i])) {
          this.badcellPostfixNo2[i] = this.badcellPostfixNo[i]
        }
        // cellPrefixNo.push()
      }
      if (this.badcellPostfixNo2.length !== 0) {
        this.showbadcells = true
      } else {
        this.showbadcells = false
      }
      let cellReadings: any = [];
      this.healthbatteryBank = result.data.name;
      let deviceReadings: any[] = result.data.cells;
      if (isValid(result.data.soc)) {
        this.socReading = result.data.soc.toFixed(2);
      } if (isValid(result.data.temperature)) {
        this.temperatureReading = result.data.temperature.toFixed(2);
      }
      if (deviceReadings.length === 0) {
        this.showHealthCells = false;
        return false;
      }
      this.showHealthCells = true;
      deviceReadings.forEach(data => {
        let cellReadings: any = {};
        if (data.status === "Good") {
          data['statusClass'] = "sensor-ok";
        }
        else if (data.status === "Check Required") {
          data['statusClass'] = 'sensor-checkRequired';
        } else if (data.status === "Bad") {
          data['statusClass'] = "sensor-critical";
        } else {
          //data['statusClass'] = 'gray';
        }
        //cellReadings.push(cellReadings);
      })

      deviceReadings.sort(this.dynamicSort("sensorId"));
      this.healthrow1 = deviceReadings.slice(0, 6);
      this.healthrow2 = deviceReadings.slice(6, 12);
      this.healthrow3 = deviceReadings.slice(12, 18);
      this.healthrow4 = deviceReadings.slice(18, 24);
    }, err => {})

  }
  /**
** This function is used to get health status colors data
*/
  getHealthStatusColors(data) {
    var statusColor = "";
    switch (data) {
      case "Good":
        statusColor = "#289642";
        break;
      case "Bad":
        statusColor = "#e00025";
        break;
      case "Check Required":
        statusColor = "#f9c043";
        break;
      default:
        statusColor = "#dddddd";

    }
    return statusColor;
  }
  /**
  ** This function is used to get ah Out data and display data in charts
  */
  public ahOutChart() {
    var self = this;
    var input = {
      userToken: this.token,
      assetId: this.assetInfoMarkerID,
      chartType: "current"
    }
    this._siteInfoService.getTrendChart(this.tenantId, input).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'ahOutChart getTrendChart', "result:" + JSON.stringify(result));
      let recordsX: any[] = result.returnedValue.data.timeMills;
      let recordsY: any[] = result.returnedValue.data.readings;
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      var chartState = "";
      recordsX.reverse();
      recordsY.reverse();

      if (this.currentState === "Charging" || this.currentState === "Float") {
        chartState = "AH In";
      } else {
        chartState = "AH Out";
      }
      if (recordsX.length === 0) {
        xaxisData.push(this.noData);
        seriesData.push('0');
      } else {
        recordsX.forEach(data => {
          xaxisData.push(data);
        });
        recordsY.forEach(data => {
          seriesData.push(data);
        });
      }

      this.chart = new Chart({
        chart: {
          type: 'line',
          backgroundColor: 'white'
        },
        title: {
          text: chartState,
          style: {
            color: 'black',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        },
        credits: {
          enabled: false
        },
        tooltip: { enabled: false, backgroundColor: 'none' },
        xAxis: {
          categories: xaxisData,
          labels: {
            enabled: false
          }
        },
        yAxis: {
          title: {
            text: ""
          },
          labels: {
            enabled: true
          }
        },
        legend: {
          enabled: false
        },
        exporting: {
          buttons: {
            contextButton: {
              enabled: false,
              theme: {
                states: {
                  hover: {
                    fill: '#fcc',
                  },
                  select: {
                    fill: '#cfc',
                  }
                }
              },
              menuItems: this.menuItemsArray,
            },
          }
        },
        series: [{
          name: this.ahOut,
          data: seriesData
        }],
        plotOptions: {
          series: {
            cursor: 'pointer',
            events: {
              mouseOver: function (event) {
                event.preventDefault()
                this.chart.chartBackground.css({
                  color: 'black',
                  opacity: '0.2'
                });
                this.chart.renderer.label("<div id='sa'> <span class='info-box-icon' style='cursor:pointer;text-align:center;font-size:30px' data-toggle='modal' data-target='#trend-chart'  ><i style='color: white;' class='fa fa-line-chart'></i></span></div>", 150, 60, null, null, null, true)
                  .attr({
                    id: 'ahOutChartIcon'
                  }).add();
                document.getElementById("sa").addEventListener("click", function (event) {
                  event.preventDefault();
                  self.enlargedChart(chartState)
                });
              },
              mouseOut: function () {
                this.chart.chartBackground.css({
                  color: 'white',
                });
                this.chart.renderer.label("<div></div>", 150, 60, null, null, null, true).add();
                jQuery('#ahOutChartIcon').remove();
                jQuery('#sa').remove();
              }
            }
          }
        }
      });
    }, err => {})
  }


  /**
  ** This function is used to display data in enlarged view of charts
  */
  public enlargedChart(label) {
    this.sensorReadingsGraph = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      tooltip: {
        formatter: function () {
          return this.x + '<br> <b>Reading</b>:' + this.y;
        }
      },
      xAxis: {
        categories: [],
        //  type: 'datetime'
      },
      credits: {
        enabled: false
      },
      series: [{
        name: "Time",
        data: []
      }]
    });

    this.labelName = label;
    if (label === "Voltage") {
      this.voltageEnlargedView()
    } else if (label === "AH Out" || label === "AH In") {
      this.ahOutEnlargedView()
    } else if (label === "Temperature") {
      this.tempEnlargedView()
    }
  }


  /**
  ** This function is used to get ah Out data and display data in enlarged view
  */
  public ahOutEnlargedView() {
    var input = {
      userToken: this.token,
      assetId: this.assetInfoMarkerID,
      chartType: "current"
    }
    this._siteInfoService.getTrendChart(this.tenantId, input).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'ahOutEnlargedView getTrendChart', "result:" + JSON.stringify(result));

      var chartState = "";

      if (this.currentState === "Charging" || this.currentState === "Float") {
        chartState = "AH In";
      } else {
        chartState = "AH Out";
      }

      let recordsX: any[] = result.returnedValue.data.timeMills;
      let recordsY: any[] = result.returnedValue.data.readings;
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      recordsY.reverse();
      recordsX.reverse();
      if (recordsX.length === 0) {
        xaxisData.push(this.noData);
        seriesData.push('0');
      } else {
        recordsX.forEach(data => {
          var time = moment(data).format("DD MMM HH:mm");
          xaxisData.push(time);
        });
        recordsY.forEach(data => {
          var value;
          if (isValid(data)) {
            value = parseFloat(this.decimalPipe.transform(data, '1.0-2'));
          } else {
            value = data;
          }
          seriesData.push(value);
        });
      }

      this.sensorReadingsGraph = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: chartState
        },
        yAxis: {
          title: {
            text: chartState + " (A)"
          },
          // labels: {
          //   format: '{value:.2f}'
          // }
        },
        tooltip: {
          formatter: function () {
            return this.x + '<br> <b>Reading</b>:' + this.y;
          }
        },
        xAxis: {
          categories: xaxisData,
          // type: 'datetime'
        },
        credits: {
          enabled: false
        },
        exporting: {
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
        series: [{
          name: "Time",
          data: seriesData
        }]
      });
    }, err => {})
  }


  /**
  ** This function is used to get temperature data and display data in enlarged view
  */
  public tempEnlargedView() {
    var self = this;
    var input = {
      userToken: this.token
    }
    this._siteInfoService.getTemperatureInfo(input, this.tenantIdSelected, this.assetInfoMarkerID).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'tempEnlargedView getTrendChart', "result:" + JSON.stringify(result));

      let records: any[] = result.data;
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      if (records.length === 0) {
        xaxisData.push(this.noData);
        seriesData.push('0');
      } else {
        records.forEach(data => {
          xaxisData.push(data.time);
          var value;
          if (isValid(data.value)) {
            value = parseFloat(this.decimalPipe.transform(data.value, '1.0-2'));
          } else {
            value = data.value;
          }
          seriesData.push(data.value);
        });
      }
      this.sensorReadingsGraph = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: 'Temperature'
        },
        yAxis: {
          title: {
            text: 'Temperature' + ' (C)'
          }
        },
        tooltip: {
          formatter: function () {
            return this.x + '<br> <b>Reading</b>:' + this.y;
          }
        },
        xAxis: {
          categories: xaxisData,
          // type: 'datetime'
        },
        credits: {
          enabled: false
        },
        exporting: {
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
        series: [{
          name: "Time",
          data: seriesData
        }]
      });
    })
  }


  /**
  ** This function is used to get temperature data and display data in charts
  */
  public tempChart() {
    var self = this;
    var input = {
      userToken: this.token
    }
    this._siteInfoService.getTemperatureInfo(input, this.tenantIdSelected, this.assetInfoMarkerID).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'tempChart', "result:" + JSON.stringify(result));
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
      this.chart1 = new Chart({
        chart: {
          type: 'line',
          backgroundColor: 'white'
        },
        title: {
          text: 'Temperature',
          style: {
            color: 'black',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        },
        credits: {
          enabled: false
        },
        tooltip: { enabled: false, backgroundColor: 'none' },
        yAxis: {
          title: {
            text: ""
          },
          labels: {
            enabled: true
          }
        },
        xAxis: {
          categories: xaxisData,
          labels: {
            enabled: false
          }
        },
        legend: {
          enabled: false
        },
        exporting: {
          buttons: {
            contextButton: {
              // symbol: 'printIcon',
              enabled: false,
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
        series: [{
          name: "Temperature",
          data: seriesData
        }],
        plotOptions: {
          series: {
            cursor: 'pointer',
            events: {
              mouseOver: function (event) {
                event.preventDefault()
                this.chart.chartBackground.css({
                  color: 'black',
                  opacity: '0.2'
                });
                this.chart.renderer.label("<div id ='aa'><span class='info-box-icon' style='cursor:pointer;text-align:center;font-size:30px' data-toggle='modal' data-target='#trend-chart'  href><i style='color: white;' class='fa fa-line-chart'></i></span></div>", 150, 60, null, null, null, true).attr({
                  id: 'tempChartIcon'
                }).add();
                document.getElementById("aa").addEventListener("click", function (event) {
                  self.enlargedChart('Temperature')
                  event.preventDefault();
                });
              },
              mouseOut: function () {
                this.chart.chartBackground.css({
                  color: 'white',
                });
                jQuery('#tempChartIcon').remove();
                jQuery('#aa').remove();
              }
            },
          }
        }
      });
    }, err => {})
  }

  /**
  ** This function is used to get voltage data and display data in charts
  */
  public voltageChart() {
    var self = this;
    var input = {
      userToken: this.token,
      assetId: this.assetInfoMarkerID,
      chartType: "voltage"
    }
    this._siteInfoService.getTrendChart(this.tenantId, input).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'voltageChart', "result:" + JSON.stringify(result));
      let recordsX: any[] = result.returnedValue.data.timeMills;
      let recordsY: any[] = result.returnedValue.data.readings;
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      recordsX.reverse();
      recordsY.reverse();
      if (recordsX.length === 0) {
        xaxisData.push(this.noData);
        seriesData.push('0');
      } else {
        recordsX.forEach(data => {
          xaxisData.push(data);
        });
        recordsY.forEach(data => {
          seriesData.push(data);
        });
      }
      this.chart2 = new Chart({
        chart: {
          type: 'line',
          backgroundColor: 'white'
        },
        title: {
          text: 'Voltage',
          style: {
            color: 'black',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        },
        yAxis: {
          title: {
            text: ""
          },
          labels: {
            enabled: true
          }
        },
        xAxis: {
          categories: xaxisData,
          // type: 'datetime',
          labels: {
            enabled: false
          }
        },
        credits: {
          enabled: false
        },

        legend: {
          enabled: false
        },
        exporting: {
          buttons: {
            contextButton: {
              // symbol: 'printIcon',
              enabled: false,
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
        tooltip: { enabled: false, backgroundColor: 'none' },
        series: [{
          name: "Voltage",
          data: seriesData
        }],
        plotOptions: {
          series: {
            cursor: 'pointer',
            events: {
              mouseOver: function (event) {
                event.preventDefault();
                this.chart.chartBackground.css({
                  color: 'black',
                  opacity: '0.2'
                });
                this.chart.renderer.label("<div id ='bb'><span class='info-box-icon' style='cursor:pointer;text-align:center;font-size:30px' data-toggle='modal' data-target='#trend-chart'  href><i style='color: white;' class='fa fa-line-chart'></i></span></div>", 150, 60, null, null, null, true).attr({
                  id: 'voltageChartIcon'
                }).add();
                document.getElementById("bb").addEventListener("click", function (event) {
                  self.enlargedChart('Voltage')
                  event.preventDefault();
                });
              },
              mouseOut: function () {
                this.chart.chartBackground.css({
                  color: 'white',
                });
                jQuery('#voltageChartIcon').remove();
                jQuery('#bb').remove();
              }
            }
          }
        }
      });
    }, err => {})
  }

  /**
  ** This function is used to get temperature data and display data in enlarged view of charts
  */
  public voltageEnlargedView() {
    var input = {
      userToken: this.token,
      assetId: this.assetInfoMarkerID,
      chartType: "voltage"
    }
    this._siteInfoService.getTrendChart(this.tenantId, input).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'voltageEnlargedView', "result:" + JSON.stringify(result));
      let recordsX: any[] = result.returnedValue.data.timeMills;
      let recordsY: any[] = result.returnedValue.data.readings;
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      recordsX.reverse();
      recordsY.reverse();
      if (recordsX.length === 0) {
        xaxisData.push(this.noData);
        seriesData.push('0');
      } else {
        recordsX.forEach(data => {
          var time = moment(data).format("DD MMM HH:mm");
          xaxisData.push(time);
        });
        recordsY.forEach(data => {
          var value;
          if (isValid(data)) {
            value = parseFloat(this.decimalPipe.transform(data, '1.0-2'));
          } else {
            value = data;
          }
          seriesData.push(value);
        });
      }

      this.sensorReadingsGraph = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: 'Voltage'
        },
        yAxis: {
          title: {
            text: 'Voltage' + " (V)"
          }
        },
        tooltip: {
          formatter: function () {
            return this.x + '<br> <b>Reading</b>:' + this.y;
          }
        },
        xAxis: {
          categories: xaxisData,
          // type: 'datetime'
        },
        credits: {
          enabled: false
        },
        exporting: {
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
        series: [{
          name: "Time",
          data: seriesData
        }]
      });
    }, err => {})
  }

  /**
  ** This function is used to get cell data and display data in enlarged view of charts
  */
  public cellEnlargedView(row) {
    this.sensorReadingsGraph = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      tooltip: {
        formatter: function () {
          return this.x + '<br> <b>Reading</b>:' + this.y;
        }
      },
      xAxis: {
        categories: [],
        // type: 'datetime'
      },
      credits: {
        enabled: false
      },
      series: [{
        name: "Time",
        data: []
      }]
    });
    this.labelName = row.label;
    var input = {
      userToken: this.token,
      assetId: this.assetInfoMarkerID,
      chartType: "cells",
      key: row.label
    }
    this._siteInfoService.getTrendChart(this.tenantId, input).subscribe((result: any) => {
      let recordsX: any[] = result.returnedValue.data.timeMills;
      let recordsY: any[] = result.returnedValue.data.readings;
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      recordsX.reverse();
      recordsY.reverse();
      if (recordsX.length === 0) {
        xaxisData.push(this.noData);
        seriesData.push('0');
      } else {
        recordsX.forEach(data => {
          var time = moment(data).format("DD MMM HH:mm");
          xaxisData.push(time);
        });
        recordsY.forEach(data => {
          //var cellData = this.decimalPipe.transform(data, '1.0-3');
          var value;
          if (isValid(data)) {
            value = parseFloat(this.decimalPipe.transform(data, '1.0-2'));
          } else {
            value = data;
          }
          seriesData.push(value);
        });
      }
      this.sensorReadingsGraph = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: 'Voltage'
        },
        yAxis: {
          title: {
            text: 'Voltage (V)'
          }
        },
        tooltip: {
          formatter: function () {
            return this.x + '<br> <b>Reading</b>:' + this.y;
          }
        },
        xAxis: {
          categories: xaxisData,
          // type: 'datetime'
        },
        credits: {
          enabled: false
        },
        exporting: {
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
        series: [{
          name: "Time",
          data: seriesData
        }]
      });
    }, err => {})
  }

  ngOnDestroy() {
    // Will clear when component is destroyed e.g. route is navigated away from.
    // clearInterval(this.timer);
    this.liveChartIntervals.forEach(timer => {
      clearInterval(timer);
    });
  }
  closeWindow() {
    this.paginationKey = '';
  }

  /**
  ** This function is used to get asset info
  */
  loadData() {
    this.customReadingsArray = [];
    this.customReadingsArrayTemperature = [];
    this.assetInfoMarkerID = JSON.parse(sessionStorage.getItem('assetInfoMarker')).asset_id;
    let nextPaginationKey = this.nextPageKey + this.activePage * this.page['size'];

    //get assets api
    let queryData = {
      userToken: JSON.parse(sessionStorage.getItem('sessionInfo')).token,
      assetId: this.assetInfoMarkerID,

    };

    this.logger.info('ASSETINFO', 'GetAssetsService', "input:" + JSON.stringify(queryData));
    // api call for get assets data
    this._siteInfoService.getAssetInfo(queryData).subscribe((result: any) => {
      console.log(result);
      this.logger.info('ASSETINFO', 'Get Asset Details Service', "results:" + JSON.stringify(result));
      let response = result.returnedValue.status;
      let data = result.returnedValue.data;
      this.assetId = data.assetId;
      this.assetName = data.assetName;
      this.currentAddress = data.metaData.c_address;
      this.movedAddress = data.c_movedAddress;
      this.distance = data.movedDistance;
      console.log(this.distance / 1000)
      if ((this.distance < 100) || !(isValid(this.distance))) {
        this.showtheftalert = false;
      } else {
        this.showtheftalert = true;

      }
      this.distance = Math.round((data.movedDistance) / 100) / 10; //converting distance meters in to KMs

      //   this.assetName = replaceSpaceWithUnderScope(this.assetName)
      this.assetAddress = data.metaData.c_address;
      this.healthState = data.healthState;
      this.currentState = data.cycleData.currentState;
      if (this.healthState == "Good") {
        this.healthStateColor = "green";
      } else if (this.healthState == "Check Required") {
        this.healthStateColor = "#ff9900"
      } else if (this.healthState == "Bad") {
        this.healthStateColor = "#c2092e";
      }
      if (this.currentState == "Charging") {
        this.currentStateColor = "#ff9900";
      } else if (this.currentState == "Float") {
        this.currentStateColor = "green"
      } else if (this.currentState == "Discharging") {
        this.currentStateColor = "#c2092e"
      }
      //  this.millisecondsDateFormat = data.cycleData.cycleStartTimeStampMillis;
      this.millisecondsDateFormat = moment(data.cycleData.cycleStartTimeStampMillis).format("DD MMM HH :mm");
      var tempTime = moment.duration(data.cycleData.cycleDuration);
      //this.cycleDuration =  tempTime.days() + " day(s) " +tempTime.hours() + "°" + tempTime.minutes() + "'" + tempTime.seconds() + "''";
      if (tempTime.days() === 0) {
        this.cycleDuration = tempTime.hours() + "°" + tempTime.minutes() + "'" + tempTime.seconds() + "''";
      } else {
        var days = tempTime.days()
        //  this.cycleDuration = (24*days)+ tempTime.hours() + "°" + tempTime.minutes() + "'" + tempTime.seconds() + "''";
        this.cycleDuration = tempTime.days() + " day(s) " + tempTime.hours() + "°" + tempTime.minutes() + "'" + tempTime.seconds() + "''";
      }

      if (isValid(data.cycleData.soc)) {
        this.socPercentage = data.cycleData.soc.toFixed(2) + "%";
      } else {
        this.socPercentage = "NA";
      }
      if (isValid(data.temperature)) {
        this.temperature = data.temperature.toFixed(1) + "°C";
      } else {
        this.temperature = "NA";
      }
      if (isValid(data.voltage)) {
        this.voltage = data.voltage.toFixed(1) + " v";
      } else {
        this.voltage = "NA";
      }

      if (isValid(data.cycleData.previousTimeStampMillis)) {
        this.reportedTime = this.datePipe.transform(new Date(data.cycleData.previousTimeStampMillis), 'MM-dd-yyyy HH:mm:ss');;
      } else {
        this.reportedTime = "NA";
      }
      if (this.currentState === "Charging") {
        //this.ahOut = data.cycleData.ahIn.toFixed(2) + " Ah";
        if (isValid(data.cycleData.ahInTotal)) {
          this.ahOut = data.cycleData.ahInTotal.toFixed(2) + " Ah";
        } else {
          this.ahOut = "NA";
        }
        console.log(data.cycleData.peakChargeCurrent);
        if (data.cycleData.peakChargeCurrent !== null) {
          this.peakLoadCurrent = data.cycleData.peakChargeCurrent.toFixed(1) + " A";
        }
      } else if (this.currentState === "Float") {
        if (isValid(data.cycleData.ahInTotal)) {
          this.ahOut = data.cycleData.ahInTotal.toFixed(2) + " Ah";
        } else {
          this.ahOut = "NA";
        }
        if (isValid(data.cycleData.peakChargeCurrent)) {
          this.peakLoadCurrent = data.cycleData.peakChargeCurrent.toFixed(2) + " Ah";
        } else {
          this.peakLoadCurrent = "NA";
        }
      } else {
        if (isValid(data.cycleData.ahOutTotal)) {
          this.ahOut = data.cycleData.ahOutTotal.toFixed(2) + " Ah";
        } else {
          this.ahOut = "NA";
        }
        if (isValid(data.cycleData.peakLoadCurrent)) {
          this.peakLoadCurrent = data.cycleData.peakLoadCurrent.toFixed(1) + " A";
        } else {
          this.peakLoadCurrent = "NA";
        }
        if (isValid(data.cycleData.avgLoadCurrent)) {
          this.avgLoadCurrent = data.cycleData.avgLoadCurrent.toFixed(1) + " A";
        } else {
          this.avgLoadCurrent = "NA";
        }

      }
      if (isValid(data.cycleData.cumulativeAhOut)) {
        this.cumulativeAhOut = data.cycleData.cumulativeAhOut.toFixed(2) + " Ah";
      } else {
        this.cumulativeAhOut = "NA";
      }
      if (isValid(data.cycleData.pcv)) {
        this.pcv = data.cycleData.pcv.toFixed(2) + " v";
      } else {
        this.pcv = "NA";
      }
      this.dischargeCyclesCount = data.cycleData.dischargeCyclesCount;
      this.weakCellsCount = data.cycleData.weakCellsCount;
      if (this.weakCellsCount == 0) {
        this.weakCellCountColor = "text-success";
      } else if (this.weakCellsCount == 1) {
        this.weakCellCountColor = "text-warning";
      } else {
        this.weakCellCountColor = "text-danger";
      }
      this.originalVoltage = data.metaData.voltage + " v";
      this.OriginalAhCapacity = data.metaData.capacity + " Ah";
      this.installationDate = data.metaData.installationDate;
      if (isValid(data.metaData.installationDate)) {
        const installationDate = this.datePipe.transform(new Date(data.metaData.installationDate), 'MMM-y');
        // this.installationDate = installationDate + " " + moment.tz.zone(moment.tz.guess()).abbr(new Date(data.installationDate).getTime());
        this.installationDate = installationDate
      } else {
        this.installationDate = 'NA';
      }
    }, err => {});

    // api call for getSensorsByAsset data table
    let input = {
      "order": { "dir": this.sortOrder, "column": this.sortColumn },
      "start": this.start, "length": this.page['size'],
      "userToken": JSON.parse(sessionStorage.getItem('sessionInfo')).token,
      "nextPaginationKey": nextPaginationKey,
      "filter": [],
      "assetId": this.assetInfoMarkerID
    }

    if (isValid(this.search)) {
      input['search'] = { "value": this.search, "searchType": "sw" }
    }

    this.logger.info('ASSETINFO', 'GetDeviceAndReadings', "input:" + JSON.stringify(input));
    this._siteInfoService.getDeviceAndReadings(this.tenantId, input).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'GetDeviceAndReadings', "results:" + JSON.stringify(result));
      this.assetChartsData = result.returnedValue.data.records;
      let response: boolean = result.returnedValue.status;
      //let itemsTotal = result.data.recordsTotal;
      let deviceReadings: any[] = result.returnedValue.data.records;
      this.deviceReadingsArray = [];
      deviceReadings.forEach(data => {
        const sensorTableData: any = {};
        let d = new Date(data._modified);
        let sensorType = data._customInfo.data.value;
        let units = "";

        if (isValid(data._customInfo.data.units)) {
          if (data._customInfo.data.units.toUpperCase() === 'F' || data._customInfo.data.units.toUpperCase() === 'C') {
            units = '°' + data._customInfo.data.units.toUpperCase();
          } else {
            units = data._customInfo.data.units;
          }
        }
        sensorTableData['deviceId'] = data._customInfo.internal_name;
        sensorTableData['label'] = data._customInfo.data.label;
        sensorTableData['deviceName'] = data._customInfo.internal_name;

        let updatedDate = this.datePipe.transform(new Date(data._modified), 'MM/dd/yyyy HH:mm:ss');
        sensorTableData['_modified'] = updatedDate + " " + moment.tz.zone(moment.tz.guess()).abbr(data._modified);
        this.reportingTime = data._modified;
        if (isValid(data._modified)) {
          const reportingTime = this.datePipe.transform(new Date(data._modified), 'd-MMMM-y, h:mm a');
          this.reportingTime = reportingTime + " " + moment.tz.zone(moment.tz.guess()).abbr(new Date(data._modified).getTime());
        } else {
          this.reportingTime = 'No data available';
        }
        // sensorTableData['_modified'] = d.toLocaleString();
        sensorTableData['internalName'] = data._customInfo.internalName;
        sensorTableData['sensorColor'] = data._customInfo.data.sensorColor;
        if (sensorTableData['internalName'] === "Movement") {
          this.showChart = false;
          sensorTableData['image'] = this.showChart;
        } else {
          this.showChart = true;
          sensorTableData['image'] = this.showChart;
        }
        if (!isValid(data._customInfo.data.sensorColor)) {
          sensorTableData['statusClass'] = "sensor-ok";
          sensorTableData['cellColor'] = "#ffffff";
          sensorTableData['customColor'] = "text-success";
        } else {
          if (sensorTableData.sensorColor.toUpperCase() === 'GREEN') {
            sensorTableData['statusClass'] = "sensor-ok";
            sensorTableData['cellColor'] = "#ffffff";
            sensorTableData['customColor'] = "text-success";
          } else if (sensorTableData.sensorColor.toUpperCase() === 'YELLOW') {
            //sensorTableData['statusClass'] = "#ff9900";
            sensorTableData['statusClass'] = "sensor-checkRequired";
            sensorTableData['cellColor'] = "#ff9900";
            sensorTableData['customColor'] = "text-warning";
          } else if (sensorTableData.sensorColor.toUpperCase() === 'RED') {
            sensorTableData['statusClass'] = "sensor-critical";
            sensorTableData['cellColor'] = "#ebd2d2";
            sensorTableData['customColor'] = "text-danger";
          } else if (sensorTableData.sensorColor.toUpperCase() === 'ORANGE') {
            sensorTableData['statusClass'] = "#e24626";
            sensorTableData['cellColor'] = "#e24626";
            sensorTableData['customColor'] = "text-warning";
          }
        }
        if (isValid(data._customInfo.data.value)) {
          sensorTableData['value'] = this.decimalPipe.transform(data._customInfo.data.value, '1.0-3') + ' ' + units;

        } else {
          sensorTableData['value'] = "NA";
          sensorTableData['statusClass'] = "sensor-ok";
          sensorTableData['cellColor'] = "#0F8942";
          sensorTableData['customColor'] = "text-success";
        }

        if (isValid(data._customInfo.data.dischargeCyclesCount)) {
          if (data._customInfo.data.dischargeCyclesCount === 0) {
            sensorTableData['displayIcon'] = false;
          } else {
            sensorTableData['displayIcon'] = true;
          }

          sensorTableData['dischargeCyclesCount'] = data._customInfo.data.dischargeCyclesCount;
        } else {
          sensorTableData['displayIcon'] = false;
        }


        this.deviceReadingsArray.push(sensorTableData);
      });
      this.deviceReadingsArray.sort(this.dynamicSort("label"));
      this.rows1 = this.deviceReadingsArray;
      this.page['pageNumber'] = this.activePage;
      this.page['size'] = this.page['size'];
      // this.page['totalElements'] = itemsTotal;
      //  this.rows.length = itemsTotal;
      this.row1 = this.deviceReadingsArray.slice(0, 6);
      this.row2 = this.deviceReadingsArray.slice(6, 12);
      this.row3 = this.deviceReadingsArray.slice(12, 18);
      this.row4 = this.deviceReadingsArray.slice(18, 24);
    }, err => {});

  }


  /**
  ** This function is used to sort the data
  */
  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  /**
  ** This function is used to get sensor readings
  */
  trendChart(data) {
    this.deviceId = data.deviceId;
    this.labelName = data.label;
    let today = new Date();
    let day = '' + (today.getDate());
    let month = '' + (today.getMonth() + 1); //January is 0!
    let yyyy = today.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    this.date = yyyy + '/' + month + '/' + day;
    this.from = this.date;
    this.to = this.date;
    this.daterange = [new Date(this.from), new Date(this.to)];
    // filter modal popup
    this.assetInfoForm = this.formBuilder.group({
      // fromDate: [this.date, ''],
      // toDate: [this.date, '']
      bsRangeValue: [this.daterange, '']

    }, {})
    this.getSensorReadings(this.assetInfoForm, false);
  }



  /**
  ** This function is used to get sensor readings
  */
  getSensorReadings({ value, valid }: {
    value: {
      bsRangeValue: Date;
    }, valid: boolean
  }, isSearch) {
    let from = value.bsRangeValue[0].getFullYear() + '/' + (value.bsRangeValue[0].getMonth() + 1) + '/' + (value.bsRangeValue[0].getDate());
    let to = value.bsRangeValue[1].getFullYear() + '/' + (value.bsRangeValue[1].getMonth() + 1) + '/' + (value.bsRangeValue[1].getDate());

    if (new Date(from).getTime() > new Date(to).getTime()) {
      this.translate.get('INFO.FROM_DATE_SHOULD_LESS_THAN_DATE').subscribe((res: string) => {
        this.toastrService.warning(res, '');
      });
      return false;
    }

    if (this.paginationKey === undefined) {
      this.paginationKey = '';
    }
    let postData = {
      "userToken": JSON.parse(sessionStorage.getItem('sessionInfo')).token,
      "assetId": this.assetInfoMarkerID,
      "deviceId": this.deviceId,
      "length": this.page['size'],
      "filter": [{ "key": "s_label", "value": this.labelName.toLowerCase(), "filterType": "eq" },
      { "key": "timeStampMillis", "value": new Date(to).getTime() + (24 * 60 * 60 * 1000), "filterType": "lteq" },
      { "key": "timeStampMillis", "value": new Date(from).getTime() + 19800000, "filterType": "gteq" }],
      "nextPaginationKey": this.paginationKey,
      "order": { "column": "_created", "dir": "desc" }
    }

    if (isSearch) {
      postData['nextPaginationKey'] = '';
      postData.userToken = this.token;
      this.prevKeyFlag = false;
      this.nextKeyFlag = false;
      this.pagingData = {
        countPrev: 0,
        prevKey: "",
        nextKey: ""
      };
    }
    this.logger.info('ASSETINFO', 'getDeviceReadingsInTrendGraph', "input:" + JSON.stringify(postData));
    this._siteInfoService.getDeviceReadingsInTrendGraph(postData).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'getDeviceReadingsInTrendGraph', "results:" + JSON.stringify(result));
      this.translate.get('INFO.NO_DATA_AVAILABLE').subscribe((res: string) => {
        this.noData = res;
      });
      this.paginationKey = result.returnedValue.data.nextPaginationKey;
      if (this.prevKeyFlag) {
        this.nextKeyFlag = true;
      }
      if (this.paginationKey !== "" && this.paginationKey !== undefined && this.paginationKey !== null) {
        this.prevKeyFlag = true;
      } else {
        this.prevKeyFlag = false;
      }
      let records: any[] = result.returnedValue.data.records;
      records.reverse();
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      let yvalue;
      let yaxisRange;
      let titleText;
      if (records.length === 0) {
        //xaxisData.push('No Data Available');
        seriesData.push(this.noData);
      } else {
        records.forEach(data => {
          var datePipe = new DatePipe("en-US");
          //xaxisData.push(datePipe.transform(data._created, 'yyyy-MM-dd'));
          let sensorReading;
          if (data._customInfo.label === "Temperature") {
            yvalue = "Temperature (C)";
            yaxisRange = null;
            titleText = "Temperature"
          } else if (data._customInfo.label === "Current") {
            yvalue = "Current(A)";
            yaxisRange = null;
            titleText = "Current"
          } else {
            yvalue = "Voltage (v)"
            yaxisRange = 0.1;
            titleText = "Voltage"
          }
          if (typeof data._customInfo.value === 'string' || data._customInfo.value instanceof String) {
            var reading1 = parseInt(data._customInfo.value).toFixed(2);
            sensorReading = parseFloat(reading1);
          }
          else if (typeof data._customInfo.value === 'number') {
            var reading = data._customInfo.value.toFixed(2);
            sensorReading = parseFloat(reading);
          }
          seriesData.push([data._created, sensorReading]);
        });
      }
      this.sensorReadingsGraph = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: titleText
        },
        yAxis: {
          title: {
            text: yvalue
          },
          tickInterval: yaxisRange
        },
        xAxis: {
          // type: 'datetime'
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Time',
          data: seriesData
        }]
      });
    }, err => {});
  };

  //Search based on sensor name
  updateFilter(event) {
    let val = event.target.value.toLowerCase();
    this.start = 0;
    this.search = val;
    this.activePage = 0;
    this.loadData();
  }

  //No of rows for page pageLimit
  pageLimit(num: any) {
    this.activePage = 0;
    this.page['size'] = (num);
    this.loadData();
  }

  // Pagination
  setPage(event) {
    this.start = event.offset * 10;
    this.activePage = event.offset;
    this.loadData();
  }

  // Sorting columns
  onSort(event) {
    this.activePage = 0;
    this.sortColumn = event.column.prop;
    this.sortOrder = event.newValue;
    this.start = 0;
    this.loadData();
  }

  /**
  ** This function is used to load readings
  */
  private loadReadings(postData) {
    return new Promise((resolve, reject) => {
      this._siteInfoService.getDeviceReadings(postData).subscribe((data: any) => {
        if (data.returnedValue.status) {
          let records: any[] = data.returnedValue.data.records;
          records.reverse();
          let yvalue;
          let yaxisRange;
          let sensorsData: any[] = [];
          if (records.length !== 0) {
            records.forEach(record => {
              let sensorReading;
              if (record._customInfo.label === "Temperature") {
                yvalue = "Temperature (C)";
                yaxisRange = null;
              } else if (record._customInfo.label === "Current") {
                yvalue = "Current(A)";
                yaxisRange = null;
              } else {
                yvalue = "Voltage (v)"
                yaxisRange = 0.1;
              }
              if (typeof record._customInfo.value === 'string' || record._customInfo.value instanceof String) {
                var reading1 = parseInt(record._customInfo.value).toFixed(2);
                sensorReading = parseFloat(reading1);
                // sensorReading = parseInt(record._customInfo.value);
              }
              else {
                var reading = record._customInfo.value.toFixed(2);
                sensorReading = parseFloat(reading);
                // sensorReading = record._customInfo.value;
              }
              sensorsData.push([record._created, sensorReading, yvalue, yaxisRange]);
            });
          }
          resolve(sensorsData);
        } else if (data.returnedValue.message.includes('WRONG_TOKEN')) {
          jQuery("#sessionExpired-modal").modal("show");
        } else if (data.returnedValue.message === "Access to this resource is forbidden.") {
          // this.toastrService.error('Failed to fetch sensor readings', '');
          this.translate.get('HTTP_ERRORS.FAILED_TO_FETCH_SENSOR_READINGS').subscribe((res: string) => {
            this.toastrService.error(res, '');
          });
        } else if (data.returnedValue.message === "Readings not found.") {
          // this.toastrService.error('Readings not found.', '');
          this.translate.get('HTTP_ERRORS.READINGS_NOT_FOUND').subscribe((res: string) => {
            this.toastrService.error(res, '');
          });
        }
      }, err => {});
    });
  }

  /**
  ** This function is used to load data based on tab change
  */
  public onAssetDetailsTabChange(tab) {
    if (tab === 'assetDetails') {
      this.loadData();
    } else if (tab === 'dischargeCycles') {
      this.dischargeCyclesData();
    } else if (tab === 'chargeCycles') {
      this.chargeCyclesData();
    }
  };

  /**
  ** This function is used to get disChargeCycles data
  */
  public dischargeCyclesData() {
    //get assets api
    let queryData = {
      userToken: JSON.parse(sessionStorage.getItem('sessionInfo')).token,
      assetId: this.assetInfoMarkerID,
      "filter": [],
      "order": { "column": this.sortColumnForCharged, "dir": this.sortOrderForCharging_Discharging }
    };
    this.logger.info('ASSETINFO', 'getDischargeCycles', "input:" + JSON.stringify(queryData));
    // api call for get assets data
    this._siteInfoService.getDischargeCycles(queryData).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'getDischargeCycles Service', "results:" + JSON.stringify(result));
      let response: boolean = result.returnedValue.status;
      let itemsTotal = result.returnedValue.data.records.length;
      let disChargeCycles: any[] = result.returnedValue.data.records;
      let disChargeCyclesArray: Array<DischargeCyclesInfo> = [];
      let disChargeCyclesDataArray: any[] = [];
      disChargeCycles.forEach(data => {
        const disChargeCyclesData: DischargeCyclesInfo = new DischargeCyclesInfo();
        disChargeCyclesData['cycleID'] = data._customInfo.cycleID;
        if (isValid(data._customInfo.data.peakLoadCurrent)) {
          disChargeCyclesData['peakLoadCurrent'] = data._customInfo.data.peakLoadCurrent + " A";
        } else {
          disChargeCyclesData['peakLoadCurrent'] = "-";
        }
        // disChargeCyclesData['avgLoadCurrent'] = data._customInfo.data.avgLoadCurrent;
        disChargeCyclesData['startTimeMillis'] = data._customInfo.startTimeMillis;
        disChargeCyclesData['endTimeMillis'] = data._customInfo.endTimeMillis;
        if (isValid(data._customInfo.data.duration)) {
          var tempTime = moment.duration(data._customInfo.data.duration);
          disChargeCyclesData['duration'] = tempTime.hours() + "°" + " " + tempTime.minutes() + "'" + " " + tempTime.seconds() + "''";
        } else {
          disChargeCyclesData['duration'] = "-";
        }
        if (isValid(data._customInfo.data.soc)) {
          disChargeCyclesData['soc'] = data._customInfo.data.soc.toFixed(2) + " %";
        } else {
          disChargeCyclesData['soc'] = "-";
        }

        if (isValid(data._customInfo.data.ahOutTotal)) {
          disChargeCyclesData['ahOutTotal'] = data._customInfo.data.ahOutTotal.toFixed(2) + " Ah";
        } else {
          disChargeCyclesData['ahOutTotal'] = "-";
        }

        // disChargeCycles.push(disChargeCyclesData);
        disChargeCyclesDataArray.push(disChargeCyclesData);
      });
      this.rowsFordisChargeCycles = disChargeCyclesDataArray;
      this.page['pageNumber'] = this.activePage;
      this.page['size'] = this.page['size'];
      this.page['totalElements'] = itemsTotal;
      this.rowsFordisChargeCycles.length = itemsTotal;
    }, err => {});

  }

  /**
  ** This function is used to get ChargeCycles data
  */
  public chargeCyclesData() {
    //get assets api
    let queryData = {
      userToken: JSON.parse(sessionStorage.getItem('sessionInfo')).token,
      assetId: this.assetInfoMarkerID,
      "filter": [],
      "order": {
        "column": this.sortColumnForCharged, "dir": this.sortOrderForCharging_Discharging
      }
    };
    this.logger.info('ASSETINFO', 'getChargeCycles', "input:" + JSON.stringify(queryData));
    // api call for get assets data
    this._siteInfoService.getChargeCycles(queryData).subscribe((result: any) => {
      this.logger.info('ASSETINFO', 'getChargeCycles Service', "results:" + JSON.stringify(result));
      let response: boolean = result.returnedValue.status;
      let itemsTotal = result.returnedValue.data.records.length;
      let chargeCycles: any[] = result.returnedValue.data.records;
      let chargeCyclesArray: Array<ChargeCyclesInfo> = [];
      let chargeCyclesDataArray: any[] = [];
      chargeCycles.forEach(data => {
        const chargeCyclesData: ChargeCyclesInfo = new ChargeCyclesInfo();
        chargeCyclesData['cycleID'] = data._customInfo.cycleID;
        // chargeCyclesData['peakChargeCurrent'] = data._customInfo.data.peakChargeCurrent;
        if (isValid(data._customInfo.data.peakChargeCurrent)) {
          chargeCyclesData['peakChargeCurrent'] = data._customInfo.data.peakChargeCurrent + " A";
        } else {
          chargeCyclesData['peakChargeCurrent'] = "-";
        }
        chargeCyclesData['startTimeMillis'] = data._customInfo.startTimeMillis;
        chargeCyclesData['endTimeMillis'] = data._customInfo.endTimeMillis;
        if (isValid(data._customInfo.data.soc)) {
          chargeCyclesData['soc'] = data._customInfo.data.soc.toFixed(2) + " %";
        } else {
          chargeCyclesData['soc'] = "-";
        }
        if (isValid(data._customInfo.data.duration)) {
          var tempTime = moment.duration(data._customInfo.data.duration);
          chargeCyclesData['duration'] = tempTime.hours() + "°" + " " + tempTime.minutes() + "'" + " " + tempTime.seconds() + "''";
        } else {
          chargeCyclesData['duration'] = "-";
        }
        if (isValid(data._customInfo.data.ahInTotal)) {
          chargeCyclesData['ahInTotal'] = data._customInfo.data.ahInTotal.toFixed(2) + " Ah";
        } else {
          chargeCyclesData['ahInTotal'] = "-";
        }
        // chargeCycles.push(chargeCyclesData);
        chargeCyclesDataArray.push(chargeCyclesData);
      });
      this.rowsForChargeCycles = chargeCyclesDataArray;

      this.page['pageNumber'] = this.activePage;
      this.page['size'] = this.page['size'];
      this.page['totalElements'] = itemsTotal;
      this.rowsForChargeCycles.length = itemsTotal;
    }, err => {});
  }

  // Sorting
  public onSortCharge(event) {
    this.activePage = 0;
    this.sortColumnForCharged = event.column.prop;
    this.sortOrder = event.newValue;
    this.start = 0;
    this.chargeCyclesData();
  }
  // Sorting
  public onSortDischarge(event) {
    this.activePage = 0;
    this.sortColumnForDisCharged = event.column.prop;
    this.sortOrder = event.newValue;
    this.start = 0;
    this.dischargeCyclesData();
  }

  /**
  ** This function is used to get charge_dischargeCycleChartInfo data
  */
  charge_dischargeCycleChartInfo(row) {
    var chargeCycleType = "";
    this.logger.info("Discharge and Charging Cycles Info" + JSON.stringify(row));
    if (isValid(row.ahInTotal)) {
      chargeCycleType = "Cumulative AH In"
    } else {
      chargeCycleType = "Cumulative AH Out"
    }
    var input = {
      fromDate: row.startTimeMillis,
      toDate: row.endTimeMillis,
      userToken: this.token
    }
    var chargeType = "";
    if (isValid(row.peakChargeCurrent)) {
      chargeType = "charging";
      this.chargeTypeName = "Charging Cycles";
    } else if (isValid(row.peakLoadCurrent)) {
      chargeType = "discharging";
      this.chargeTypeName = "Discharging Cycles";
    }

    this.logger.info("Discharge Cycles Input Info" + JSON.stringify(input));
    this._siteInfoService.charge_dischargeVoltageChartInfo(input, this.tenantIdSelected, this.assetInfoMarkerID, chargeType).subscribe((result: any) => {
      this.logger.info("Voltage Chart Info" + JSON.stringify(result));
      let data: any[] = result.data;
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      if (data.length === 0) {
        xaxisData.push(this.noData);
        seriesData.push('0');
      } else {
        data.forEach(data => {
          var time = moment(data.time).format("DD MMM  HH:mm");
          xaxisData.push(time);
          var value;
          if (isValid(data.value)) {
            value = parseFloat(this.decimalPipe.transform(data.value, '1.0-2'));
          } else {
            value = data.value;
          }
          seriesData.push(value)
        });
      }
      this.VoltageChartGraph = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: 'Voltage'
        },
        yAxis: {
          title: {
            text: 'Voltage (V)'
          }
        },
        tooltip: {
          formatter: function () {
            return this.x + '<br> <b>Reading</b>:' + this.y;
          }
        },
        xAxis: {
          categories: xaxisData,
          // type: 'datetime'
        },
        credits: {
          enabled: false
        },

        exporting: {
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
        series: [{
          name: "Time",
          data: seriesData
        }
        ]
      });
    }, err => {})

    this._siteInfoService.charge_dischargeAHChartInfo(input, this.tenantIdSelected, this.assetInfoMarkerID, chargeType).subscribe((result: any) => {
      this.logger.info("AHOUT Chart Info" + JSON.stringify(result));
      let data: any[] = result.data;
      let xaxisData: any[] = [];
      let seriesData: any[] = [];
      if (data.length === 0) {
        xaxisData.push(this.noData);
        seriesData.push('0');
      } else {
        data.forEach(data => {
          var time = moment(data.time).format("DD MMM  HH:mm");
          xaxisData.push(time);
          var value;
          if (isValid(data.value)) {
            value = parseFloat(this.decimalPipe.transform(data.value, '1.0-2'));
          } else {
            value = data.value;
          }
          seriesData.push(value)
        });
      }

      this.AHOUTChartGraph = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: chargeCycleType
        },
        yAxis: {
          title: {
            text: chargeCycleType + " (A)"
          }
        },
        tooltip: {
          formatter: function () {
            return this.x + '<br> <b>Reading</b>:' + this.y
          }
        },
        xAxis: {
          categories: xaxisData,
          //type: 'datetime'
        },
        credits: {
          enabled: false
        },

        exporting: {
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
        series: [{

          name: "Time",
          data: seriesData
        }]
      });

    }, err => {})
  }

}