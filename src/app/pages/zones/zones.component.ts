import { Session } from './../../models/Session';
import { isValid } from './../../shared/utils/utils';
import { ZonesService } from './../../services/zones/zones.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
@Component({
     selector: 'az-zones',
     encapsulation: ViewEncapsulation.None,
     templateUrl: './zones.component.html',
     providers: [ZonesService],

})
export class ZonesComponent implements OnInit {
     private zoneForm: FormGroup;
     editing = {};
     itemsPerPage = new FormControl('10');
     private rows: Array<Object> = [];
     public page = {
          size: this.itemsPerPage.value,
          totalElements: 0,
          pageNumber: 0,
     };
     private nextPageKey = '200/';
     private space = ' ';
     private activePage = 0;
     private start = 0;
     private search = "";
     private searchObject = {};
     private sortOrder: string = "asc";
     private sortColumn = "c_name";
     public Add_or_Edit: string = '';
     public Create_or_Update: string = '';
     private zoneNameToDelete = "";
     private zoneId = "";
     tenantUrl = "";
     private token = "";
     CONFIG_DATA: any;
     private session: Session;
     public loading = false;
     constructor(private http: HttpClient, private translate: TranslateService, private formBuilder: FormBuilder, public toastrService: ToastrService, private _zonesService: ZonesService, private logger: NGXLogger) {
          this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
          this.token = this.session.token;
          this.Add_or_Edit = 'Add';
          this.Create_or_Update = 'Create';
          this.zoneForm = this.formBuilder.group({
               zoneName: ['', Validators.compose([Validators.required])],
          }, {})
     }

     ngOnInit() {
          this.loadData();
     }
     /**
** This function is used to get zones data
*/
     loadData() {
          let nextPaginationKey = this.nextPageKey + this.activePage * this.page['size'];
          if (this.search === "") {
               this.searchObject = { "value": "", "regex": false };
          } else {
               this.searchObject = { "value": this.search, "regex": false };
          }
          let input = {
               'order': { "dir": this.sortOrder, "column": this.sortColumn },
               "start": this.start,
               'length': this.page['size'],
               'userToken': this.token,
               'nextPaginationKey': nextPaginationKey,
               "search": this.searchObject,
               "filter": []
          };

          if (this.search != "") {
               input.filter = [{ "key": "s_name", "value": this.search, "filterType": "sw" }]
          }
          this.logger.info('ZONEINFO', 'GetZones', "input:" + JSON.stringify(input));

          // api call for get users data
          this.loading = true;
          this._zonesService.getZones(input).subscribe((result: any) => {
               this.loading = false;
               let itemsTotal = result.returnedValue.data.recordsTotal;
               let zones: any[] = result.returnedValue.data.records;
               let zonesArray: any[] = [];
               zones.forEach(data => {
                    const jsonData: any = {};
                    jsonData['c_name'] = data._customInfo.c_name;
                    let assetsCount = data._customInfo.assets;
                    if (isValid(assetsCount)) {
                         jsonData['assets_Count'] = assetsCount.length;
                    } else {
                         jsonData['assets_Count'] = 0;
                    }
                    let techniciansCount = data._customInfo.technician_users;
                    if (isValid(techniciansCount)) {
                         jsonData['technicians_count'] = techniciansCount.length;
                    } else {
                         jsonData['technicians_count'] = 0;
                    }
                    let observersCount = data._customInfo.observer_users;
                    if (isValid(observersCount)) {
                         jsonData['observers_count'] = observersCount.length;
                    } else {
                         jsonData['observers_count'] = 0;
                    }
                    jsonData['c_id'] = data._customInfo.c_id;
                    zonesArray.push(jsonData);
               });
               this.rows = zonesArray;
               this.page['pageNumber'] = this.activePage;
               this.page['size'] = this.page['size'];
               this.page['totalElements'] = itemsTotal;
               this.rows.length = itemsTotal;

          }, err => this.loading = false);
     }

     //Search based on username
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

     onActivate(event) {
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

     //add Zone popup
     addZonePrompt() {
          this.Add_or_Edit = 'Add';
          this.Create_or_Update = 'Create';
          this.zoneForm = this.formBuilder.group({
               zoneName: ['', Validators.required],
          })
     }

     //edit Zone popup
     editZonePrompt(event) {
          this.Add_or_Edit = 'Edit';
          this.Create_or_Update = 'Update';
          this.zoneId = event.c_id;
          this.zoneForm = this.formBuilder.group({
               zoneName: [event.c_name, Validators.required],
          })
     }

     //delete Zone popup
     deleteZonePrompt(event) {
          if (event.assets_Count > 0) {
               //jQuery("#deleteZone-Modal").modal("hide");
               this.translate.get('INFO.UNASSIGN_ASSET_FROM_ZONE').subscribe((res: string) => {
                    this.toastrService.warning(res, '');
               });
               return false;
          }
          jQuery("#deleteZone-Modal").modal("show");
          this.zoneNameToDelete = event.c_name;
          this.zoneId = event.c_id;
     }

     //getZoneID
     getZoneId(event) {
          sessionStorage.setItem('zoneId', event.c_id);
     }

     /**
     ** This function is used to add or edit zones
     */
     public addOrEditZone({ value, valid }: {
          value: {
               zoneName: string;
          }, valid: boolean
     }) {
          if (this.Add_or_Edit === "Add") {
               let addData = {
                    userToken: this.token,
                    zoneData: {
                         c_name: value.zoneName
                    }
               }
               this.loading = true;
               this._zonesService.addZone(addData).subscribe((result: any) => {
                    this.loading = false;
                    this.translate.get('ZONES.SUCCESS.CREATION_SUCCESS').subscribe((res: string) => {
                         this.toastrService.success(res, '');
                    });
                    jQuery("#addZone-modal").modal("hide");
                    this.loadData();
               }, err => this.loading = false);
          } else if (this.Add_or_Edit === "Edit") {
               let editData = {
                    userToken: this.token,
                    zoneData: {
                         c_name: value.zoneName
                    },
                    c_id: this.zoneId
               }
               // Update Zone service call
               this.loading = true;
               this._zonesService.updateZone(editData).subscribe((result: any) => {
                    this.loading = false;
                    let response: boolean = result.returnedValue.status;

                    this.translate.get('ZONES.SUCCESS.UPDATION_SUCCESS').subscribe((res: string) => {
                         this.toastrService.success(res, '');
                    }, err => this.loading = false);
                    jQuery("#addZone-modal").modal("hide");
                    this.loadData();

               });
          }
     }

     /**
     ** This function is used to delete zone
     */
     public deleteZone() {
          var deleteData = {
               userToken: this.token,
               c_id: this.zoneId
          };
          this.loading = true;
          this._zonesService.deleteZone(deleteData).subscribe((result: any) => {
               this.loading = false;
               let response: boolean = result.returnedValue.status;
               this.translate.get('ZONES.SUCCESS.DELETION_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(res, '');
               }, err => this.loading = false);
               jQuery("#deleteZone-Modal").modal("hide");
               this.loadData();

          });
     }
}