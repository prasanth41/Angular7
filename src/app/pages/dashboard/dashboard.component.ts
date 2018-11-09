import { HttpClient } from '@angular/common/http';
import { isValid, replaceSpaceWithUnderScope } from './../../shared/utils/utils';
import { DashboardService } from './../../services/dashboard/dashboard.service';
import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormControl, FormBuilder } from '@angular/forms';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Chart } from 'angular-highcharts';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AppConfig } from "../../app.config";
import { Session } from '../../models/Session';
@Component({
    selector: 'az-dashboard',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [DashboardService, DecimalPipe],
})
export class DashboardComponent {
    itemsPerPage = new FormControl('10');
    private lat: number = 38.68551;
    private lng: number = -96.503906;
    private zoom: number = 12;
    private rows: Array<Object> = [];
    healthStateChart: any = {}
    chargeStateChart: any = {}
    private temperatureRows: Array<Object> = [];
    private criticalBankBatteryRows: Array<Object> = [];
    private theftRows: Array<Object> = [];
    private page: any = {
        size: this.itemsPerPage.value,
        totalElements: 0,
        pageNumber: 0,
    };

    private pageTemperatureExcursions: any = {
        size: this.itemsPerPage.value,
        totalElements: 0,
        pageNumber: 0,
    };
    // [fullscreenControl]="true"
    // [fullscreenControlOptions]="screenOptions
    private pageCriticalBanks: any = {
        size: this.itemsPerPage.value,
        totalElements: 0,
        pageNumber: 0,
    };

    private pageTheftWarnings: any = {
        size: this.itemsPerPage.value,
        totalElements: 0,
        pageNumber: 0,
    };
    private weakBatteryDate = "";
    private theftBatteryDate = "";
    private assetNameToDelete = "";
    private assetIdToDelete = "";
    private nextPageKey = '200/';
    private activePage = 0;
    private statusCardIsChecked = {};
    private activePageTemperatureExcursion: number = 0;
    private activePageCriticalBank: number = 0;
    private activePageTheftWarning: number = 0;

    private startForTemperatureExcursion: number = 0;
    private startForCriticalBank: number = 0;
    private startForTheftWarning: number = 0;

    private searchForTemperatureExcursion: string = "";
    private searchForCriticalBank: string = "";
    private searchForTheftWarning: string = "";

    private sortOrderForTemperatureExcursion: string = "desc";
    private sortOrderForCriticalBank: string = "desc";
    private sortOrderForTheftWarning: string = "desc";
    private listvar = [];
    private start = 0;
    private search = "";
    private sortOrder = "asc";
    private sortColumn = "_created";
    private sortAssetColumn = "_created";
    private token = "";
    private render: boolean = false;
    private latlongs = [];
    private latlngBounds;
    private statusArray: any = [];
    private tenants: any = [];
    private models: any = [];
    private filter: any = {};
    private isEverywhereEnabled: boolean = false;
    private enableTenant: boolean;
    private showTenant: boolean;
    private infoWindowOpened = null;
    private theftBatteries: any = {};
    private criticalBatteryBanks: any = {};
    private fakeData3: any = {};
    private temperatureExcursionBanks: any = {};
    private weakBatteries: any = {};
    private latestTheftWarningCount: number;
    private latestCriticalBatteryCount: number;
    private latestTemperatureExcursionCount: number;
    private latestWeakBatteriesCount: number;
    private totalBatteryBanks: number;
    private criticalBatteryPercentage: number;
    private monitoredBatteriesCount: number;
    private temperatureFromDate = "";
    private criticalBankFromDate = "";
    private theftFromDate = "";
    private totalWeakBatteries = "";
    private totalCriticalBanks: number;
    private sensorsIssuesChart: string;
    private issuesLabel: string;
    private assetStatusChart: string;
    private assetsLabel: string;
    private batteryTime: any;
    private emailFormArray: any = []
    private zoneFormArray: any = []
    options: any = {};
    issuesData: any = {};
    goodVsBadCells: any = {};
    data: any;
    public option: any = {}
    public isChecked: any = {}
    public bdata: any;
    private mapview: boolean = false
    private showLargeMap: boolean = false;
    private showLargeList: boolean = true;
    private showMap: boolean = true;
    private showList: boolean = false;
    private batteryWithStatus: boolean;
    private statusOptions: any = [{ status: "OK", color: "checkbox-success" }, { status: "Warning", color: "checkbox-warning" }, { status: "Critical", color: "checkbox-danger" }, { status: "Not Yet Reported", color: "checkbox-default" }];
    private zonesArray: any = [];
    private showHealthdata: boolean = false;
    private showChargedata: boolean = false;
    private tableRows: any = [];
    private theftBatterytableRows: any = [];

    private weakBatteriesCount: number;
    private theftBatteriesCount: number;
    previous;
    private healthrow1 = [];
    private healthrow2 = [];
    private healthrow3 = [];
    private healthrow4 = [];
    private healthbatteryBank: string = "";
    private voltageColor = "";
    private socColor = "";
    private temperatureColor = "";
    private voltageReading = "";
    private socReading = "";
    private temperatureReading = "";
    private health_batteryReportedTime;
    private showHealthCells: boolean = true;
    private tenantIdSelected = '';
    @ViewChild('search') searchElementRef: ElementRef;
    //   @ViewChild('charts') chartsData: ChartsComponent;
    public origin: any
    public destination: any
    public destinationLatLngArray = [];
    public originLatLng = {};
    public destinationLatLng = {}
    public view = {};
    public checkedView = {};
    public cardCheckedView = {};
    private theftbatteryobj = {
        originAddress: '',
        destinationLatLng: {}
    }
    private badcellPostfixNo = [];
    private badcellPostfixNo2 = [];
    private showbadcells: boolean = false;
    private session: Session
    constructor(private decimalPipe: DecimalPipe, private _appConfig: AppConfig, private _dashboardService: DashboardService, private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone, public toastrService: ToastrService, private http: HttpClient, private logger: NGXLogger, private translate: TranslateService, ) {

        this.statusArray = this._appConfig.statusArray;
        this.filter = this._dashboardService.getAssetsFilterData();
        this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
        this.tenantIdSelected = "";

        if (JSON.parse(sessionStorage.getItem('sessionInfo')).tenantType !== 'Tenant') {
            if (isValid(this.filter['tenant'])) {
                this.tenantIdSelected = this.filter['tenant'];
            } else {
                this.tenantIdSelected = 'all';
            }
        } else {
            this.tenantIdSelected = JSON.parse(sessionStorage.getItem('sessionInfo')).tenantId;
        }

        this.view = this._dashboardService.getIsEveryWhere();
        this.checkedView = this._dashboardService.getIsChecked();
        this.cardCheckedView = this._dashboardService.getIsCardChecked();
        this.filter['isEveryWhereEnabled'] = this.view['isEveryWhereEnabled']
    }

    ngAfterViewInit() {
    }


    ngOnInit(): void {
        if (isValid(this.filter['isEveryWhereEnabled'])) {
            this.isEverywhereEnabled = this.filter['isEveryWhereEnabled'];
        } else {
            this.isEverywhereEnabled = false;
        }

        if (this.filter['chargeStatus'] == 'All' && this.filter.status == 'All') {
            this.batteryWithStatus = false;
            this.showHealthdata = false;
            this.showChargedata = false;
        } else if (this.filter['chargeStatus'] == 'All' && this.filter.status !== 'All') {
            this.batteryWithStatus = true;
            this.showHealthdata = true;
            this.showChargedata = false;
        } else if (this.filter['chargeStatus'] !== 'All' && this.filter.status == 'All') {
            this.batteryWithStatus = true;
            this.showHealthdata = false;
            this.showChargedata = true;
        } else {
            this.batteryWithStatus = true;
            this.showHealthdata = true;
            this.showChargedata = true;
        }

        // this.isChecked = {
        //   Name: true, healthState: true, zone: false, estimated_backupTime: true, estimated_capacity: true, temperature: true, overAll_Voltage: true,
        //   current: true, state: true, status: true, SOC: true, dischargeCells: true, weakBatteries: true, reportedTime: false
        // }
        this.isChecked = this.checkedView;
        this.statusCardIsChecked = this.cardCheckedView;
        // this.statusCardIsChecked = { healthState: true, chargingState: true, weakBatteries: true, theftBatteries: true }
        this._dashboardService.currentFilterData.subscribe(data => this.data = data);
        if (this.session.tenantType === "Master") {
            this.enableTenant = true;
            this.showTenant = false;
        } else if (this.session.tenantType === "Tenant") {
            this.enableTenant = false;
            this.showTenant = true;
        }

        //this.loadCharts();
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                //  types: ["address"]
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    this.filter.address = place.formatted_address;
                    //this._dashboardService.setAssetsFilter(this.filter);
                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                });
            });
        });
        this.loadAssetsData();
        // this.barCharts();
        //this.barCharts1();
        this.getHealthState();
        this.getChargeState();
        this.weakcellCharts();
        this.filter.healthStatus = "ALL";
        this.getZones();
        this.theftBatteriesChart();
    }
    public onclickCheckbox() {
        this._dashboardService.setIsChecked(this.isChecked);
    }
    public onclickCardCheckbox() {
        this._dashboardService.setIsCardChecked(this.statusCardIsChecked);
    }
    public onEvent(event) {
        event.stopPropagation();
    }
    //On Change
    public onTabChange(tab) {
        if (tab === 'map' || tab === 'list') {
            this.loadAssetsData();
            //this.loadCharts();
        } else if (tab === 'charts') {
            // this.loadCharts();
        }
    };

    public getTheftInfo(index) {
        this.theftbatteryobj.originAddress = this.theftBatterytableRows[index].address;
        this.theftbatteryobj.destinationLatLng = this.destinationLatLngArray[index];
        sessionStorage.setItem('theftBatteryInfoMarker', JSON.stringify(this.theftbatteryobj));
    }


    /**
    ** This function is used to get health state data and display data in charts
    */
    public getHealthState() {
        var input = {
            "filter": [
                {}
            ],
            "userToken": JSON.parse(sessionStorage.getItem('sessionInfo')).token
        }

        this._dashboardService.getHealthStateService(this.tenantIdSelected, input).subscribe((result: any) => {
            this.logger.info('DASHBOARD', 'Get Health State', 'results:' + JSON.stringify(result));
            var healthStateData = result.data.status;
            var healthData: any = [];
            healthStateData.forEach(data => {
                var color = "";
                if (data.status === "Good") {
                    data['color'] = '#289642'
                } else if (data.status === "Check Required") {
                    data['color'] = '#f9c043'
                } else if (data.status === "Bad") {
                    data['color'] = '#e00025'
                } else if (data.status === "NA") {
                    data['color'] = '#bcbec0'
                } else {
                    data['color'] = '#dddddd'
                }
                healthData.push({
                    name: data.status,
                    y: data.statusCount,
                    color: data.color
                })
            })
            this.healthStateChart = new Chart({
                exporting: {
                    enabled: false,
                },

                chart: {
                    type: 'pie',
                    margin: [0, 0, 0, 0],
                    spacingTop: 0,
                    spacingBottom: 0,
                    spacingLeft: 0,
                    spacingRight: 0,
                    events: {
                        // load: addTitle,
                        // redraw: addTitle,
                    },
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: null,

                },
                legend: {
                    align: 'left',
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                if (this.y != 0) return this.y;
                            },
                            distance: -10,
                            style: {
                                fontWeight: 'bold',
                                color: 'black',
                            }
                        },
                        showInLegend: false,
                        // startAngle: 0,
                        // endAngle: 360,
                        // center: ['50%', '50%'],
                        size: '100%',
                        innerSize: '50%',
                        depth: 45,
                        point: {
                            events: {
                                select: (event) => {
                                    //  this.barCharts1();
                                    this.healthState(event);
                                },
                                unselect: (event) => {
                                    //  this.barCharts1();
                                    this.healthState(event);
                                }
                            }

                        }
                    }
                },
                // series: this.chargingData
                series: [{
                    name: 'Count',
                    data: healthData,
                    // type: 'column',

                }]
            });
        })
    }
    /**
    ** This function is used to get charing state data and display data in charts
    */
    public getChargeState() {
        var input = {
            "filter": [
                {}
            ],
            "userToken": JSON.parse(sessionStorage.getItem('sessionInfo')).token
        }

        this._dashboardService.getChargeStateService(this.tenantIdSelected, input).subscribe((result: any) => {
            this.logger.info('DASHBOARD', 'Get Charge State', 'results:' + JSON.stringify(result));
            var chargeStateData = result.data.status;
            var chargingData: any = [];
            chargeStateData.forEach(data => {
                var color = "";
                if (data.status === "Discharging") {
                    data['color'] = '#e00025'
                }
                else if (data.status.toUpperCase() === "CHARGING") {
                    data['color'] = '#f9c043'
                } else if (data.status === "Float") {
                    data['color'] = 'Green'
                } else if (data.status === "NR") {
                    data['color'] = '#bcbec0'
                } else {
                    data['color'] = '#bcbec0'
                }
                chargingData.push({
                    name: data.status,
                    y: data.statusCount,
                    color: data.color
                });
                console.log(chargingData);

            })
            chargingData.forEach((data, index) => {
                if (data.name.toUpperCase() == "NA") {
                    chargingData.remove(data);
                }
            })
            console.log(chargingData);

            this.chargeStateChart = new Chart({
                exporting: {
                    enabled: false,
                },
                chart: {
                    type: 'pie',
                    margin: [0, 0, 0, 0],
                    spacingTop: 0,
                    spacingBottom: 0,
                    spacingLeft: 0,
                    spacingRight: 0,
                    events: {
                        // load: addTitle,
                        // redraw: addTitle,
                    },
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: null,

                },
                legend: {
                    align: 'left',
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                return this.y;
                            },
                            distance: -10,
                            color: 'black'
                        },

                        showInLegend: false,
                        size: '100%',
                        innerSize: '50%',
                        depth: 45,
                        point: {
                            events: {
                                select: (event) => {
                                    //  this.barCharts1();
                                    this.chargeState(event);
                                },
                                unselect: (event) => {
                                    this.chargeState(event);
                                }
                            }
                        }
                    }
                },
                // series: this.chargingData
                series: [{
                    name: 'Count',
                    data: chargingData,
                    // type: 'column',
                }]
            });
        })
    }

    /**
    ** This function is used to get well cells data and display data in charts
    */
    weakcellCharts() {
        var input = {
            "userToken": JSON.parse(sessionStorage.getItem('sessionInfo')).token
        }

        this._dashboardService.getWeakBatteryCellCount(this.tenantIdSelected, input).subscribe((result: any) => {
            this.logger.info('DASHBOARD', 'Get Weak Battery State', 'results:' + JSON.stringify(result));
            var xaxisData: any = [];
            var seriesData: any = [];
            var weakBatteryCells = result.data;
            weakBatteryCells.forEach(data => {
                xaxisData.push(data.time);
                seriesData.push(data.count);
            })
            this.weakBatteries = new Chart({
                exporting: {
                    enabled: false,
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: null
                },
                chart: {
                    type: 'spline',
                    backgroundColor: 'rgba(255, 255, 255, 0.0)',
                    margin: 0,
                },
                xAxis: {
                    visible: false,
                    categories: xaxisData
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    visible: false
                },
                // plotOptions: {
                //   series: {

                //     events: {
                //       click: (e) => {

                //         alert('Category: ' + this.category + ', value: ' + this.y);
                //       }
                //     },
                //     //color: '#a0eefe',
                //     showInLegend: false,
                //   }
                // },
                plotOptions: {
                    //showInLegend: false,

                    series: {
                        showInLegend: false,
                        cursor: 'pointer',

                        events: {
                            click: (e) => {

                                this.getWeakBatteriesWithCells(e.point.category, e.point.y)
                            }

                        }

                    }
                },

                series: [{
                    name: 'Count',
                    data: seriesData
                }],
            });
        })
    }

    /**
    ** This function is used to get weak batteries list
    */
    getWeakBatteriesWithCells(date, value) {
        if (value == 0) {
            this.translate.get('DASHBOARD.WARNING.NO_BATTERIES').subscribe((res: string) => {
                this.toastrService.warning(res, '');
            });
            return false;
        }
        jQuery("#openWeakBatteries-Modal").modal("show");
        this.logger.info("WeakBatteriesWithCells" + date);
        this.weakBatteryDate = date;

        var input = {
            "filter": [
                { key: "fromDate", value: date }
            ],
            "userToken": JSON.parse(sessionStorage.getItem('sessionInfo')).token
        }
        this._dashboardService.getWeakBatteryCells(this.tenantIdSelected, input).subscribe((result: any) => {
            this.logger.info('DASHBOARD', 'Get Weak Battery cells List', 'results:' + JSON.stringify(result));
            this.weakBatteriesCount = value;
            var data: any[] = result.data.assets;
            this.tableRows = data;
        })
    }

    theftBatteriesChart() {
        var input = {
            "userToken": JSON.parse(sessionStorage.getItem('sessionInfo')).token
        }

        this._dashboardService.getTheftBatteryCellCount(this.tenantIdSelected, input).subscribe((result: any) => {
            console.log(result);
            this.logger.info('DASHBOARD', 'Get Weak Battery State', 'results:' + JSON.stringify(result));
            var xaxisData: any = [];
            var seriesData: any = [];
            var theftBatteryCells = result.data;
            theftBatteryCells.forEach(data => {
                xaxisData.push(data.time);
                seriesData.push(data.count);
            })
            this.theftBatteries = new Chart({
                exporting: {
                    enabled: false,
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: null
                },
                chart: {
                    type: 'spline',
                    backgroundColor: 'rgba(255, 255, 255, 0.0)',
                    margin: 0,
                },
                xAxis: {
                    visible: false,
                    categories: xaxisData
                    // categories: ["2018-09-26", "2018-09-27", "2018-09-28", "2018-09-29", "2018-09-30", "2018-10-01", "2018-10-02", "2018-10-03", "2018-10-04", "2018-10-05"]

                },
                yAxis: {
                    title: {
                        text: null
                    },
                    visible: false
                },
                plotOptions: {
                    series: {
                        showInLegend: false,
                        cursor: 'pointer',

                        events: {
                            click: (e) => {

                                this.getTheftBatteriesWithCells(e.point.category, e.point.y)
                            }

                        }

                    }
                },

                series: [{
                    name: 'Theft Battery Count',
                    data: seriesData
                    // [0, 1, 0, 0, 1, 1, 0, 0, 2, 0]
                }],
            });
        })
    }

    getTheftBatteriesWithCells(date, value) {
        if (value == 0) {
            this.translate.get('DASHBOARD.WARNING.NO_BATTERIES_THEFT').subscribe((res: string) => {
                this.toastrService.warning(res, '');
            });
            return false;
        }
        jQuery("#openTheftBatteries-Modal").modal("show");
        this.logger.info("WeakBatteriesWithCells" + date);
        this.theftBatteryDate = date;
        var input = {
            "filter": [
                { key: "fromDate", value: date }
            ],
            "userToken": JSON.parse(sessionStorage.getItem('sessionInfo')).token
        }
        this._dashboardService.getTheftBatteryBanks(this.tenantIdSelected, input).subscribe((result: any) => {
            this.logger.info('DASHBOARD', 'Get Theft Battery Banks List', 'results:' + JSON.stringify(result));
            console.log(result);
            this.theftBatteriesCount = result.data.recordsTotal;
            var data: any[] = result.data.assets;
            this.theftBatterytableRows = data;

            this.theftBatterytableRows.forEach((data, index) => {
                this.theftBatterytableRows[index].movedDistance = Math.round((data.movedDistance) / 100) / 10;
            })

            this.destinationLatLngArray = [];
            this.theftBatterytableRows.forEach((data) => {
                this.destinationLatLngArray.push({ lat: data.lat, lng: data.lon })
            });
            console.log(this.theftBatterytableRows);
        })
    }
    /**
    ** This function is used to set current position
    */
    private setCurrentPosition(data) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.loadBatteriesData(data);
                this.getAddress(position.coords.latitude, position.coords.longitude);
            });
        }
    }

    /**
    ** This function is used to get address based on lat long values
    */
    getAddress(lat, lng) {
        this.mapsAPILoader.load().then(() => {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'location': new google.maps.LatLng(lat, lng) }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        this.filter['address'] = results[1].formatted_address;
                        this._dashboardService.setAssetsFilter(this.filter);
                    } else {
                        this.logger.info('DASHBOARD', 'GetAddress', "Location not found");
                    }
                } else {
                    this.logger.info('DASHBOARD', 'GetAddress', "Geocoder failed due to:" + status);
                }
            });
        });
    }

    /**
    ** This function is used to get batteries when filter with checkbox
    */
    batteriesfiltercheckbox(event) {
        if (this.filter.OK == true || this.filter.Critical == true || this.filter.Not_yet_reported == true || this.filter.Warning == true) {
            this.filter.status = event;
        } else { this.filter.status = "All"; }
        // this.filter.batteryStatus = this.option
        // if(this.filter.)
        this._dashboardService.setAssetsFilter(this.filter);
        this.loadAssetsData();
    }

    /**
    ** This function is used to get assets
    */
    onChange() {
        setTimeout(() => {
            this.filterAssetsData();
        }, 1000);
    }

    /**
    ** This function is used to get assets when everywhere radio button selected
    */
    onEverywhereSelected() {
        this.isEverywhereEnabled = true;
        this.filter['isEveryWhereEnabled'] = true;
        this.view['isEveryWhereEnabled'] = this.filter['isEveryWhereEnabled'];
        this.filterAssetsData();
        this._dashboardService.setIsEveryWhere(this.view);
    }
    /**
    ** This function is used to get assets when radius radio button selected
    */
    onRadiusSelected() {
        this.isEverywhereEnabled = false;
        this.filter['isEveryWhereEnabled'] = false;
        this.filter['radius'] = 50;
        this.filter['address'] = '';
        this.filterAssetsData();
        this.view['isEveryWhereEnabled'] = this.filter['isEveryWhereEnabled'];
        this._dashboardService.setIsEveryWhere(this.view);
    }
    /**
    ** This function is used to get assets when slider changes
    */
    onSliderChange() {
        this.filter['radius'] = this.filter.radius;
        this._dashboardService.setAssetsFilter(this.filter);
        this.filterAssetsData();
    }

    mouseEnter(event) {
        console.log("mouse enter : " + event);
    }

    mouseLeave(div: string) {
        console.log('mouse leave :' + div);
    }

    /**
    ** This function is used to display large map view when we click on map
    */
    clickMapView() {
        this.showLargeMap = true;
        this.showLargeList = false;
        this.showList = true;
        this.showMap = false;
    }
    /**
    ** This function is used to display large list view when we click on list
    */
    clicklistView() {
        this.showMap = true;
        this.showList = false;
        this.showLargeList = true;
        this.showLargeMap = false;
    }
    /**
    ** This function is used to get health state data when we select and unselect in donut charts
    */
    healthState(event) {
        if (event.type === "select") {
            if (this.filter['chargeStatus'] == 'All') {
                this.showChargedata = false;
            }

            this.batteryWithStatus = true;
            this.showHealthdata = true;
            this.filter.healthStatusColor = event.target.color;
            this.filter['status'] = event.target.name;
            this.filterAssetsData();
        } else if (event.type === "unselect") {
            if (isValid(event.accumulate)) {
                this.filter['status'] = ['All'];
                this.showHealthdata = false;
                if (this.filter['chargeStatus'] == 'All' && this.filter['status'] == 'All') {
                    this.batteryWithStatus = false;
                }
            } else {
                this.filter.healthStatusColor = this.filter.healthStatusColor;
                this.filter['status'] = this.filter['status'];
                this.showHealthdata = true;
            }
            this.filterAssetsData();
        }
    }
    /**
    ** This function is used to get charge state data when we select and unselect in donut charts
    */
    chargeState(event) {
        if (event.type === "select") {
            if (this.filter['status'] == 'All') {
                this.showHealthdata = false;
            }
            this.batteryWithStatus = true;
            this.showChargedata = true;
            this.filter.chargeStatusColor = event.target.color;
            this.filter['chargeStatus'] = event.target.name;
            this.filterAssetsData();
        } else if (event.type === "unselect") {
            if (isValid(event.accumulate)) {
                this.filter['chargeStatus'] = ['All'];
                this.showChargedata = false;
                if (this.filter['chargeStatus'] == 'All' && this.filter['status'] == 'All') {
                    this.batteryWithStatus = false;
                }
            } else {
                this.filter.chargeStatusColor = this.filter.chargeStatusColor;
                this.filter['chargeStatus'] = this.filter['chargeStatus'];
                this.showChargedata = true;
            }
            this.filterAssetsData();
        }
    }

    /**
    ** This function is used to get zones
    */
    getZones() {
        let input = {
            'userToken': JSON.parse(sessionStorage.getItem('sessionInfo')).token
        }
        this._dashboardService.getZones(input).subscribe(result => {
            this.zonesArray = result['returnedValue'].data.records;
        })
    }

    /**
    ** This function is used to get batteries
    */
    loadAssetsData() {
        this.token = JSON.parse(sessionStorage.getItem('sessionInfo')).token;
        let nextPaginationKey = this.nextPageKey + this.activePage * this.page['size'];
        let data = {
            "filter": [],
            "start": this.start,
            "length": this.page.size,
            "nextPaginationKey": nextPaginationKey,
            "order": { "dir": this.sortOrder, "column": this.sortColumn },
            "userToken": this.token
        }

        if (isValid(this.search)) {
            data['search'] = { "value": this.search, "searchType": "sw" }
        }

        if (isValid(this.filter['status'])) {
            if (this.filter['status'][0] !== 'All') {
                data.filter.push({
                    key: 'status',
                    value: [this.filter['status']],
                    filterType: 'eq'
                });
            }
        }
        if (isValid(this.filter['chargeStatus'])) {
            if (this.filter['chargeStatus'][0] !== 'All') {
                data.filter.push({
                    key: 'chargeStatus',
                    value: [this.filter['chargeStatus']],
                    filterType: 'eq'
                });
            }
        }

        if (isValid(this.filter['zones'])) {
            if (this.filter.zones.length !== 0) {
                data.filter.push({
                    key: 'zone_id',
                    value: this.filter['zones'],
                    filterType: 'eq'
                });
            }
        }

        if (isValid(this.filter['model'])) {
            if (this.filter['model'].toUpperCase() !== 'ALL') {
                data.filter.push({
                    key: 'model',
                    value: this.filter['model'],
                    filterType: 'eq'
                });
            }
        }

        if (!this.isEverywhereEnabled) {
            if (isValid(this.filter['address'])) {
                this.mapsAPILoader.load().then(() => {
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'address': this.filter['address'] }, (results, status) => {
                        this.logger.debug('DASHBOARD', 'FilterAssetsData', "results" + JSON.stringify(results));
                        if (status === google.maps.GeocoderStatus.OK) {
                            this.lat = results[0].geometry.location.lat();
                            this.lng = results[0].geometry.location.lng();
                            //this._dashboardService.setAssetsFilter(this.filter);
                            this.loadBatteriesData(data);
                        }
                        //  else {
                        //   this.translate.get('DASHBOARD.ERROR.UNABLE_TO_FETCH_LAT_LONG').subscribe((res: string) => {
                        //      this.toastrService.error(res, '');
                        //    });
                        //    this.logger.info('DASHBOARD', 'FilterAssetsData', 'Error - ', results, ' & Status - ', status);
                        // }
                    });
                });
            } else {
                this.setCurrentPosition(data);
            }
        }
        else {
            this.loadBatteriesData(data);
        }
    }

    /**
    ** This function is used to get zones using api
    */
    loadBatteriesData(data) {
        if (!this.isEverywhereEnabled) {
            data.filter.push({
                latValue: this.lat,
                lonValue: this.lng,
                radius: this.filter['radius'],
                filterType: 'gq'
            });
        }
        this.logger.info('DASHBOARD', 'Get Assets Input' + JSON.stringify(data));
        this._dashboardService.getAssetsService(this.tenantIdSelected, data).subscribe((result: any) => {
            this.logger.info('DASHBOARD', 'Get Assets', 'results:' + JSON.stringify(result));
            let itemsTotal = result.data.recordsTotal;
            this.totalBatteryBanks = itemsTotal;
            let assets: any[] = result.data.assets;
            let assetsArray: any[] = [];
            let mapsArray: any[] = [];
            let imageIcon;
            let healthIcon;
            let statusColor;
            let chargeStatusColor;
            let stateColor;
            let batteryBackUpColor;
            if (itemsTotal === 0) {
                sessionStorage.setItem('assetInfoMarker', "");
                imageIcon = "assets/img/location-current.png";
                this.latlongs = [{ moved_location_lat: this.lat, moved_location_lon: this.lng, image: imageIcon, show: false, name: "", status: "NA", zone_name: "NA", tenat_name: "NA" }];
                // alertNotifier.showAlert(
                //   $translate.instant('DASHBOARD.SUCCESS.NO_ASSETS'), 'success', null
                //   this.translate.get('DASHBOARD.ERROR.UNABLE_TO_FETCH_LAT_LONG').subscribe((res: string) => {
                //     this.toastrService.error(res, '');
                //   });
                // );
            } else {
                sessionStorage.setItem('assetInfoMarker', JSON.stringify(assets[0]));
                assets.forEach(data => {
                    if (data.currentState === "Float") {
                        // imageIcon = "assets/img/map-status/map_battery_green_xhdpi.png";
                        chargeStatusColor = "text-success";
                        data['chargeStatusColor'] = 'green';
                    } else if (data.currentState === "Charging") {
                        // imageIcon = "assets/img/map-status/map_battery_yellow_ xhdpi.png";
                        chargeStatusColor = "text-warning";
                        data['chargeStatusColor'] = "#ff9900";
                    } else if (data.currentState === "Discharging") {
                        //  imageIcon = "assets/img/map-status/map_battery_red_xhdpi.png";
                        chargeStatusColor = "text-danger";
                        data['chargeStatusColor'] = "#ff0000";
                    } else if (data.currentState === "NA") {
                        // imageIcon = "assets/img/map-status/map_battery_grey_ xhdpi.png";
                        chargeStatusColor = "text-na";
                        data['chargeStatusColor'] = '#bcbec0';
                    }
                    if (data.status === "Good") {
                        imageIcon = "assets/img/map-status/map_battery_green_xhdpi.png";
                        statusColor = "text-success";
                        data['statusColor'] = 'green';
                    } else if (data.status === "Bad" || data.status === "Error") {
                        imageIcon = "assets/img/map-status/map_battery_red_xhdpi.png";
                        statusColor = "text-danger";
                        data['statusColor'] = "#ff0000";
                    } else if (data.status === "Check Required") {
                        imageIcon = "assets/img/map-status/map_battery_yellow_ xhdpi.png ";
                        statusColor = "text-warning";
                        data['statusColor'] = "#ff9900";
                    } else if (data.status === "NA") {
                        imageIcon = "assets/img/map-status/map_battery_grey_ xhdpi.png";
                        statusColor = "text-na";
                        data['statusColor'] = '#bcbec0';
                    }
                    if (isValid(data.currentState)) {
                        if (data.status === "Good") {
                            stateColor = "text-success";
                            data['stateColor'] = 'green';
                            //data['currentState'] = data.currentState;
                        } else if (data.status === "Bad") {
                            stateColor = "text-danger";
                            data['stateColor'] = "#ff0000";
                            //data['currentState'] = data.currentState;
                        } else if (data.status === "Check Required") {
                            stateColor = "text-warning";
                            data['stateColor'] = "#ff9900";
                            //data['currentState'] = data.currentState;
                        } else if (data.status === "NA") {
                            stateColor = "text-na";
                            data['stateColor'] = "#bcbec0";
                            // data['currentState'] = data.currentState;
                        }
                    } else {
                        data['currentState'] = "NA";
                    }
                    if (isValid(data.zone_name)) {
                        data['zone_name'] = data.zone_name
                    } else {
                        data['zone_name'] = "Not Assigned";
                    }
                    if (isValid(data.soc)) {
                        data['soc'] = this.decimalPipe.transform(data.soc, '1.0-2') + "%";
                    } else {
                        data['soc'] = "NA";
                    }

                    if (isValid(data.weakCellCount)) {
                        data['weakCellCount'] = data.weakCellCount;
                    } else {
                        data['weakCellCount'] = "NA";
                    }
                    if (isValid(data.dischargeCyclesCount)) {
                        data['dischargeCyclesCount'] = data.dischargeCyclesCount;
                    } else {
                        data['dischargeCyclesCount'] = "NA";
                    }

                    if (isValid(data.voltage_Reading)) {
                        data['overAll_Voltage'] = this.decimalPipe.transform(data.voltage_Reading, '1.0-2') + " V";
                    } else {
                        data['overAll_Voltage'] = "NA";
                    }
                    // if (this._commonUtils.isValid(data.previousTimeStampMillis)) {
                    //   data['previousTimeStampMillis'] = data.previousTimeStampMillis;
                    // } else {
                    //   data['previousTimeStampMillis'] = "NA";
                    // }

                    if (isValid(data.temperature_Reading)) {
                        data['temperature_Reading'] = this.decimalPipe.transform(data.temperature_Reading, '1.0-2') + " °C";
                    } else {
                        data['temperature_Reading'] = "NA";
                    }
                    if (isValid(data.current_Reading)) {
                        data['currentReading'] = this.decimalPipe.transform(data.current_Reading, '1.0-2');
                        data['current_Reading'] = this.decimalPipe.transform(data.current_Reading, '1.0-2') + " A";

                    } else {
                        data['currentReading'] = "NA";
                        data['current_Reading'] = "NA";
                    }

                    data['show'] = true;
                    data['image'] = imageIcon;
                    data['healthIcon'] = healthIcon;
                    data['color'] = statusColor;

                    //   data['name'] = replaceSpaceWithUnderScope(data.name)
                    assetsArray.push(data);
                    mapsArray.push(data);
                });
                this.latlongs = mapsArray;
                this.mapsAPILoader.load().then(() => {
                    this.latlngBounds = new window['google'].maps.LatLngBounds();
                    this.latlongs.forEach((location) => {
                        this.latlngBounds.extend(new window['google'].maps.LatLng(location.moved_location_lat, location.moved_location_lon));
                    })
                });
            }

            this.rows = assetsArray;
            this.listvar = assetsArray;
            this.page.pageNumber = this.activePage;
            this.page.size = this.page.size;
            this.page.totalElements = itemsTotal;
            this.rows.length = itemsTotal;
            setTimeout(() => window.dispatchEvent(new Event('resize')));
        });
    }
    markerClicked(infowindow) {
        if (this.previous) {
            this.previous.close();
        }
        this.previous = infowindow;
    }

    closeWindow() {

    }

    /**
    ** This function is used to get batteries health Info
    */
    getBatteryHealthInfo(batteryInfo) {
        this.badcellPostfixNo = [];
        this.badcellPostfixNo2 = [];
        var input = {
            userToken: this.token
        }
        var assetId = batteryInfo.asset_id;
        let cellArray = [];

        let splitdata: any;
        this._dashboardService.getHealthStateData(this.tenantIdSelected, assetId, input).subscribe((result: any) => {
            this.logger.info('DASHBOARD', 'getBatteryHealthInfo', "results:" + JSON.stringify(result));
            //let cellReadingsArray: any[] = result.data.cells;
            this.health_batteryReportedTime = result.data.statusUpdatedMillis;
            this.voltageColor = this.getHealthStatusColors(result.data.voltageStatus);
            this.socColor = this.getHealthStatusColors(result.data.socStatus);
            this.temperatureColor = this.getHealthStatusColors(result.data.temperatureStatus);
            if (isValid(result.data.voltage)) {
                this.voltageReading = result.data.voltage.toFixed(2);
            } if (isValid(result.data.soc)) {
                this.socReading = result.data.soc.toFixed(2);
            } if (isValid(result.data.temperature)) {
                this.temperatureReading = result.data.temperature.toFixed(2);
            }
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
            console.log(this.badcellPostfixNo2);
            let cellReadings: any = [];
            this.healthbatteryBank = batteryInfo.name;
            let deviceReadings: any[] = result.data.cells;
            if (deviceReadings.length === 0) {
                this.showHealthCells = false;
                return false;
            }
            this.showHealthCells = true;
            deviceReadings.forEach(data => {
                let cellReadings: any = {};
                if (data.status === "Good") {
                    data['statusClass'] = "health-ok";
                }
                else if (data.status === "Check Required") {
                    data['statusClass'] = 'health-checkRequired';
                } else if (data.status === "Bad") {
                    data['statusClass'] = "health-critical";
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
        })

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
    ** This function is used to get batteries when we select,deselect zones
    */
    zonesCheckbox(zone: string, isChecked: boolean, i) {
        if (isChecked) {
            this.filter.zones.push(zone);
        }
        else {
            this.remove(this.filter.zones, zone);
        }
        console.log(this.filter.zones);
        // this._dashboardService.setAssetsFilter(this.filter);

        this.filterAssetsData();
    }

    remove(arr, what) {
        var found = arr.indexOf(what);
        while (found !== -1) {
            arr.splice(found, 1);
            found = arr.indexOf(what);
        }
    }

    /**
    ** This function is used to filter the assets
    */
    filterAssetsData() {
        this.activePage = 0;
        this.start = 0;
        this._dashboardService.setAssetsFilter(this.filter);
        this.rows = []
        this.rows.length = 0;
        this.loadAssetsData();
    }
    /**
    ** This function is used to reset
    */
    resetDashboardFilter() {
        // this.batteryWithStatus = false;
        // this.isEverywhereEnabled = false;
        // this.filter['isEveryWhereEnabled'] = false;
        this._dashboardService.setAssetsFilter('');
        this.filter = this._dashboardService.getAssetsFilterData();
        this.loadAssetsData();
        this.batteryWithStatus = false;
        this.getHealthState()
        this.getChargeState()
    };

    /**
    ** This function is used to display info in delete asset prompt
    */
    deleteAssetPrompt(data) {
        this.assetNameToDelete = data.name;
        this.assetIdToDelete = data.asset_id;
    }
    /**
    ** This function is used to delete asset
    */
    deleteAsset() {
        this._dashboardService.deleteAsset({
            userToken: this.token,
            assetId: this.assetIdToDelete
        }).subscribe((result: any) => {
            let recordsExists = result.returnedValue.data.recordsExists;
            if (recordsExists === 0) {
                this.translate.get('DASHBOARD.SUCCESS.DELETION_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(res, '');
                });
                jQuery("#deleteAsset-Modal").modal("hide");
                this.loadAssetsData();
            } else {
                this.deleteAsset();
            }
        });
    }

    //Search based on asset name
    public updateFilter(event) {
        let val = event.target.value.toLowerCase();
        this.start = 0;
        this.search = val;
        this.activePage = 0;
        this.loadAssetsData();
    }

    //No of rows for page
    public pageLimit(num: any) {
        this.activePage = 0;
        this.start = 0;
        this.page.size = (num);
        this.loadAssetsData();
    }

    // Pagination
    public setPage(event) {
        this.start = event.offset * event.limit;
        this.activePage = event.offset;
        this.loadAssetsData();
    }
    // Sorting
    public onSort(event) {
        this.activePage = 0;
        this.sortColumn = event.column.prop;
        this.sortOrder = event.newValue;
        this.start = 0;
        this.loadAssetsData();
    }

    public assetInfo(data) {
        sessionStorage.setItem('assetInfoMarker', JSON.stringify(data));
    };

    /**
    ** This function is used to sort the table
    */
    sortTable(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("myTable");
        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc";
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 1; i < (rows.length - 1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                /*Get the two elements you want to compare,
                one from current row and one from the next:*/
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /*check if the two rows should switch place,
                based on the direction, asc or desc:*/
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /*If a switch has been marked, make the switch
                and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                //Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /*If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again.*/
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

}
