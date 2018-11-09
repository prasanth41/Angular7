import { Session } from './../../../models/Session';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { UsersService } from './../../../services/users/users.service';
import { ZoneInfoService } from './../../../services/zones/zone-info/zone-info.service';
import { ZonesService } from './../../../services/zones/zones.service';
import { isValid, replaceSpaceWithUnderScope } from './../../../shared/utils/utils';
import { Component, ViewContainerRef, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ElementRef, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

@Component({
     selector: 'az-zone-info',
     encapsulation: ViewEncapsulation.None,
     templateUrl: './zone-info.component.html',
     providers: [ZonesService, UsersService, DashboardService, ZoneInfoService]
})

export class ZoneInfoComponent implements OnInit {
     public zoneId: string = '';
     private router: Router;
     public token: string = "";

     private nextPageKey: string = '200/';
     private rowsForUsers: Array<Object> = [];
     private rowsForAssets: Array<Object> = [];
     private rowsUnassignUsers: Array<Object> = [];
     private rowsUnassignAssets: Array<Object> = [];

     selectedUser = [];
     selectedAsset = [];
     itemsPerPage = new FormControl('10');
     private pageLimitUnassignUsers = 10;
     private pageLimitUnassignAssets = 10;

     public pageUsers: any = {
          size: this.itemsPerPage.value,
          totalElements: 0,
          pageNumber: 0,
     };

     public pageAssets: any = {
          size: this.itemsPerPage.value,
          totalElements: 0,
          pageNumber: 0,
     };
     public pageUnassignUser: any = {
          size: this.itemsPerPage.value,
          totalElements: 0,
          pageNumber: 0,
     }

     public pageUnassignAsset: any = {
          size: this.itemsPerPage.value,
          totalElements: 0,
          pageNumber: 0,
     }

     private activePageUsers: number = 0;
     private activePageAssets: number = 0;
     private activePageUnAssignUser: number = 0;
     private activePageUnAssignAsset: number = 0;
     private zoneNameToDisplay: string = "";
     private startForUsers: number = 0;
     private startForAssets: number = 0;
     private startForUnassignUser: number = 0;
     private startForUnassignAsset: number = 0;


     private searchForUsers: string = "";
     private searchForAssets: string = "";
     private searchForUnassignUser: string = "";
     private searchForUnassignAsset: string = "";

     private sortOrderForUsers: string = "asc";
     private sortOrderForAssets: string = "asc";
     private sortOrderForUnassignUser: string = "asc";
     private sortOrderForUnassignAsset: string = "asc";

     private sortColumn: string;
     private searchObject: any = {};

     public tabs: any = [];
     private unassignMail: string = "";
     private unassignName: string = "";
     private userId: string = "";

     unassignUserMail: string = "";
     unassignUserName: string = "";
     unassignAssetName: string = "";
     unassignAssetId: string = "";
     private session: Session;
     @ViewChild("search")
     private searchElementRef: ElementRef;
     constructor(router: Router, private translate: TranslateService, private http: HttpClient, private formBuilder: FormBuilder, private _usersService: UsersService, public toastrService: ToastrService, private _zonesService: ZonesService, private _zoneInfoService: ZoneInfoService, private _dashboardService: DashboardService, private logger: NGXLogger) {
          this.session = JSON.parse(sessionStorage.getItem('sessionInfo'))
          this.token = this.session.token;
          this.zoneId = sessionStorage.getItem('zoneId');
          this.router = router
          if (isValid(this.zoneId))
               this.router.navigate(['/pages/zones']);
     }

     ngOnInit() {
     }

     ngAfterViewInit() {
          this.loadUsersData();
     }
     public onTabChangeZones(tab) {
          if (tab === 'users') {
               this.loadUsersData();
          } else if (tab === 'assets') {
               this.loadAssetsData();
          }
     };
     // Load users Data
     loadUsersData() {
          //Zone service to get get technicians and observers
          this._zonesService.getZones({
               userToken: this.token, filter: [{
                    key: 'c_id',
                    value: this.zoneId,
                    filterType: 'eq'
               }]
          }).subscribe((result: any) => {
               this.logger.info('ZONEINFO', 'loadUsersData', "results:" + JSON.stringify(result));
               let zone = result.returnedValue.data.records[0]._customInfo;
               this.zoneNameToDisplay = zone.c_name;
               let technicians = (isValid(zone.technician_users)) ? ((zone.technician_users.length > 0) ? zone.technician_users : ['']) : [''];
               let observers = (isValid(zone.observer_users)) ? ((zone.observer_users.length > 0) ? zone.observer_users : ['']) : [''];
               let nextPaginationKey = this.nextPageKey + this.activePageUsers * this.pageUsers['size'];
               if (this.searchForUsers === "") {
                    this.searchObject = { "value": "", "regex": false };
               } else {
                    this.searchObject = { "value": this.searchForUsers, "regex": false };
               }
               this.sortColumn = "userMail";
               let input = {
                    'order': { "dir": this.sortOrderForUsers, "column": this.sortColumn },
                    "start": this.startForUsers,
                    'length': this.pageUsers['size'],
                    'userToken': this.token,
                    'nextPaginationKey': nextPaginationKey,
                    "search": this.searchObject,
                    "filter": [{
                         "key": "userRole",
                         "value": "Admin",
                         "filterType": "neq"
                    },
                    {
                         key: 'userRole',
                         value: 'User',
                         filterType: 'neq'
                    },
                    {
                         key: 'userId',
                         value: technicians.concat(observers),
                         filterType: 'incl'
                    }, {
                         "key": "s_userMail",
                         "value": this.searchForUsers,
                         "filterType": "sw"
                    }
                    ]
               }
               this.logger.info('ZONEINFO', 'GetUsers', "input:" + JSON.stringify(input));
               // api call for get users data
               this._usersService.getUsers(input).subscribe((result: any) => {
                    let itemsTotal = result.returnedValue.data.recordsTotal;
                    let users: any[] = result.returnedValue.data.records;
                    let usersArray: any[] = [];
                    users.forEach(data => {
                         const jsonData: any = {};
                         jsonData['userMail'] = data._customInfo.s_userMail;
                         jsonData['userRole'] = data._customInfo.userRole;
                         jsonData['userName'] = data._customInfo.data.userName;
                         jsonData['userId'] = data._customInfo.userId;
                         usersArray.push(jsonData);
                    });
                    this.rowsForUsers = usersArray;
                    this.pageUsers['pageNumber'] = this.activePageUsers;
                    this.pageUsers['size'] = this.pageUsers['size'];
                    this.pageUsers['totalElements'] = itemsTotal;
                    this.rowsForUsers.length = itemsTotal;
               });
          })
     }
     //Function to load zones
     loadAssetsData() {
          //Zone service to get get technicians and observers
          this._zonesService.getZones({
               userToken: this.token, filter: [{
                    key: 'c_id',
                    value: this.zoneId,
                    filterType: 'eq'
               }]
          }).subscribe((result: any) => {
               let zone = result.returnedValue.data.records[0]._customInfo;
               let nextPaginationKey = this.nextPageKey + this.activePageAssets * this.pageAssets['size'];
               // if (this.searchForAssets === "") {
               //   this.searchObject = { "value": "", "regex": false };
               // } else {
               //   this.searchObject = { "value": this.searchForAssets, "regex": false };
               // }
               this.sortColumn = "c_name";
               let input = {
                    'order': { "dir": this.sortOrderForAssets, "column": this.sortColumn },
                    "start": this.startForAssets,
                    'length': this.pageAssets['size'],
                    'userToken': this.token,
                    'nextPaginationKey': nextPaginationKey,
                    "search": this.searchObject,
                    "filter": [{
                         key: 'c_assetId',
                         value: (isValid(zone.assets)) ? ((zone.assets.length > 0) ? zone.assets : ['']) : [''],
                         filterType: 'incl'
                    },
                    {
                         key: 'isZoneAssigned',
                         value: true,
                         filterType: 'eq'
                    }

                    ]

               }
               if (isValid(this.searchForAssets)) {
                    let search = {
                         key: "c_name",
                         value: this.searchForAssets.toLowerCase(),
                         filterType: "sw"
                    }
                    input.filter.push(search)
               }


               this.logger.info('ZONEINFO', 'GetAssets', "input:" + JSON.stringify(input));
               let tenantIdSelected = "";
               if (JSON.parse(sessionStorage.getItem('sessionInfo')).tenantType !== 'Tenant') {
                    tenantIdSelected = 'all';
               } else {
                    tenantIdSelected = JSON.parse(sessionStorage.getItem('sessionInfo')).tenantId;
               }
               // api call for get users data
               this._dashboardService.getAssets(input).subscribe((result: any) => {
                    let itemsTotal = result.returnedValue.data.recordsTotal;
                    let assets: any[] = result.returnedValue.data.records;

                    let assetsArray: any[] = [];
                    assets.forEach(data => {
                         const jsonData: any = {};
                         jsonData['name'] = data._customInfo.c_name;
                         //  jsonData['name'] = replaceSpaceWithUnderscope(jsonData['name'])
                         jsonData['address'] = data._customInfo.metaData.c_address;
                         jsonData['c_assetId'] = data._customInfo.c_assetId;
                         assetsArray.push(jsonData);
                    });
                    this.rowsForAssets = assetsArray;
                    this.pageAssets['pageNumber'] = this.activePageAssets;
                    this.pageAssets['size'] = this.pageAssets['size'];
                    this.pageAssets['totalElements'] = itemsTotal;
                    this.rowsForAssets.length = itemsTotal;
               });
          })
     }
     /**
  ** This function is used to display unassigned users in popup
  */
     showUnassignedUsersPopup() {
          this.selectedUser = [];
          this._zonesService.getZones({
               userToken: this.token, filter: [{
                    key: 'c_id',
                    value: this.zoneId,
                    filterType: 'eq'
               }]
          }).subscribe((result: any) => {
               this.logger.info('ZONEINFO', 'showUnassignedUsersPopup', "results:" + JSON.stringify(result));
               let zone = result.returnedValue.data.records[0]._customInfo;
               let technicians = (isValid(zone.technician_users)) ? ((zone.technician_users.length > 0) ? zone.technician_users : ['']) : [''];
               let observers = (isValid(zone.observer_users)) ? ((zone.observer_users.length > 0) ? zone.observer_users : ['']) : [''];
               let nextPaginationKey = this.nextPageKey + this.activePageUnAssignUser * this.pageUnassignUser['size'];
               if (this.searchForUnassignUser === "") {
                    this.searchObject = { "value": "", "regex": false };
               } else {
                    this.searchObject = { "value": this.searchForUnassignUser, "regex": false };
               }
               this.sortColumn = "userMail";
               let input = {
                    'order': { "dir": this.sortOrderForUnassignUser, "column": this.sortColumn },
                    "start": this.startForUnassignUser,
                    'length': this.pageUnassignUser['size'],
                    'userToken': this.token,
                    'nextPaginationKey': nextPaginationKey,
                    "search": this.searchObject,
                    "filter": [{
                         "key": "userRole",
                         "value": "Admin",
                         "filterType": "neq"
                    },
                    {
                         key: 'userRole',
                         value: 'User',
                         filterType: 'neq'
                    },
                    {
                         key: 'userId',
                         value: technicians.concat(observers),
                         filterType: 'notincl'
                    }, {
                         "key": "s_userMail",
                         "value": this.searchForUnassignUser,
                         "filterType": "sw"
                    }]
               }
               // api call for get users data
               this._usersService.getUsers(input).subscribe((result: any) => {

                    let itemsTotal = result.returnedValue.data.recordsTotal;
                    let users: any[] = result.returnedValue.data.records;
                    let usersArray: any[] = [];
                    users.forEach(data => {
                         const jsonData: any = {};
                         jsonData['userMail'] = data._customInfo.s_userMail;
                         jsonData['userRole'] = data._customInfo.userRole;
                         jsonData['userName'] = data._customInfo.data.userName;
                         jsonData['userId'] = data._customInfo.userId;
                         usersArray.push(jsonData);
                    });
                    this.rowsUnassignUsers = usersArray;
                    this.pageUnassignUser['pageNumber'] = this.activePageUnAssignUser;
                    this.pageUnassignUser['size'] = this.pageUnassignUser['size'];
                    this.pageUnassignUser['totalElements'] = itemsTotal;
                    this.rowsUnassignUsers.length = itemsTotal;
               });
          })
     }

     /**
     ** This function is used to display unassigned assets in popup
     */
     showUnassignedAssetsPopup() {
          this.selectedAsset = [];
          //Zone service to get get technicians and observers
          this._zonesService.getZones({
               userToken: this.token, filter: [{
                    key: 'c_id',
                    value: this.zoneId,
                    filterType: 'eq'
               }]
          }).subscribe((result: any) => {
               let zone = result.returnedValue.data.records[0]._customInfo;
               let nextPaginationKey = this.nextPageKey + this.activePageUnAssignAsset * this.pageUnassignAsset['size'];
               if (this.searchForUnassignAsset === "") {
                    this.searchObject = { "value": "", "regex": false };
               } else {
                    this.searchObject = { "value": this.searchForUnassignAsset, "regex": false };
               }
               this.sortColumn = "c_name";
               let input = {
                    'order': { "dir": this.sortOrderForUnassignAsset, "column": this.sortColumn },
                    "start": this.startForUnassignAsset,
                    'length': this.pageUnassignAsset['size'],
                    'userToken': this.token,
                    'nextPaginationKey': nextPaginationKey,
                    "search": this.searchObject,
                    "filter": [{
                         key: 'c_assetId',
                         value: (isValid(zone.assets)) ? ((zone.assets.length > 0) ? zone.assets : ['']) : [''],
                         filterType: 'notincl'
                    },
                    {
                         key: 'isZoneAssigned',
                         value: true,
                         filterType: 'neq'
                    }]
               }
               if (isValid(this.searchForUnassignAsset)) {
                    let search = {
                         "key": "s_name",
                         "value": this.searchForUnassignAsset,
                         "filterType": "sw"
                    }
                    input.filter.push(search);
               }
               let tenantIdSelected = "";
               if (JSON.parse(sessionStorage.getItem('sessionInfo')).tenantType !== 'Tenant') {
                    tenantIdSelected = 'all';
               } else {
                    tenantIdSelected = JSON.parse(sessionStorage.getItem('sessionInfo')).tenantId;
               }
               // api call for get users data
               this._dashboardService.getAssets(input).subscribe((result: any) => {
                    let itemsTotal = result.returnedValue.data.recordsTotal;
                    let assets: any[] = result.returnedValue.data.records;
                    let assetsArray: any[] = [];
                    assets.forEach(data => {
                         const jsonData: any = {};
                         jsonData['name'] = data._customInfo.c_name;
                         //  jsonData['name'] = replaceSpaceWithUnderscope(jsonData['name'])
                         jsonData['address'] = data._customInfo.metaData.c_address;
                         jsonData['assetId'] = data._customInfo.c_assetId;
                         assetsArray.push(jsonData);
                    });
                    this.rowsUnassignAssets = assetsArray;
                    this.pageUnassignAsset['pageNumber'] = this.activePageUnAssignAsset;
                    this.pageUnassignAsset['size'] = this.pageUnassignAsset['size'];
                    this.pageUnassignAsset['totalElements'] = itemsTotal;
                    this.rowsUnassignAssets.length = itemsTotal;

               });
          })
     }

     /**
     ** This function is used to assign user to zone
     */
     assignUserToZone() {
          let successCount = 0;
          let failCount = 0;
          let totalCount = 0;
          var assignUsersData = [];
          this.selectedUser.forEach(data => {
               let inputData = {
                    userToken: this.token,
                    userIdToAssign: data.userId,
                    zoneId: this.zoneId
               };
               assignUsersData.push(inputData);
          })
          this.logger.info('ZONEINFO', 'assignUserToZone', "results:" + JSON.stringify(assignUsersData));
          let requests: Observable<Response>[] = [];
          Observable.forkJoin(
               assignUsersData.map(
                    i => this._zoneInfoService.assignUserToZone(i)
                         .map(res => res)
               )
          ).subscribe((result: any) => {
               this.logger.info('ZONEINFO', 'assignUsersData', "results:" + JSON.stringify(result));
               result.forEach(data => {
                    successCount++
                    totalCount++;
               })
               this.translate.get('ZONE_INFO.USERS.SUCCESS.ASSIGN_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(successCount + ' out of ' + totalCount + ' ' + res, '');
               });

               jQuery("#unassignedUsersToZone-Modal").modal("hide");
               this.loadUsersData();
          });
     }

     /**
     ** This function is used to assign asset to zone
     */
     assignAssetToZone() {
          let successCount = 0;
          let failCount = 0;
          let totalCount = 0;
          var assignAssetsData = [];
          this.selectedAsset.forEach(data => {
               let inputData = {
                    userToken: this.token,
                    assetIdToAssign: data.assetId,
                    zoneId: this.zoneId
               };
               assignAssetsData.push(inputData);
          })
          this.logger.info('ZONEINFO', 'assignAssetToZone', "results:" + JSON.stringify(assignAssetsData));
          //let requests: Observable<Response>[] = [];
          Observable.forkJoin(
               assignAssetsData.map(
                    i => this._zoneInfoService.assignAssetToZone(i)
                         .map(res => res)
               )
          ).subscribe((result: any) => {
               this.logger.info('ZONEINFO', 'assignAssetsData', "results:" + JSON.stringify(result));
               // assignAssetsData = [];
               result.forEach(data => {
                    successCount++
                    totalCount++;
               })
               this.translate.get('ZONE_INFO.ASSETS.SUCCESS.ASSIGN_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(successCount + ' out of ' + totalCount + ' ' + res, '');
               });

               jQuery("#unassignedAssetsToZone-Modal").modal("hide");
               this.loadAssetsData();
          });
     }

     /**
     ** This function is used to display data in Unassign user from zone popup
     */
     unassignUserFromZonePrompt(event) {
          this.unassignUserMail = event.userMail;
          this.unassignUserName = event.userName;
          this.userId = event.userId;
     }

     /**
     ** This function is used to display data in Unassign asset from zone popup
     */
     unassignAssetFromZonePrompt(event) {
          this.unassignAssetName = event.name;
          this.unassignAssetId = event.c_assetId;
     }

     /**
     ** This function is used to Unassign asset from zone
     */
     unassignAssetFromZone() {
          var deleteData = {
               userToken: this.token,
               zoneId: this.zoneId,
               assetIdToUnAssign: this.unassignAssetId
          };
          // unassignAssetFromZone service call
          this._zoneInfoService.unassignAssetFromZone(deleteData).subscribe((result: any) => {
               this.translate.get('ZONE_INFO.ASSETS.SUCCESS.UNASSIGN_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(res, '');
               });
               jQuery("#unassignAssetFromZone-Modal").modal("hide");
               this.loadAssetsData();
          });
     }

     /**
     ** This function is used to Unassign user from zone
     */
     unassignUserFromZone() {
          var deleteData = {
               userToken: this.token,
               zoneId: this.zoneId,
               userIdToUnassign: this.userId
          };
          // Update Zone service call
          this._zoneInfoService.unassignUserFromZone(deleteData).subscribe((result: any) => {
               this.translate.get('ZONE_INFO.USERS.SUCCESS.UNASSIGN_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(res, '');
               });
               jQuery("#unassignUserFromZone-Modal").modal("hide");
               this.loadUsersData();

          });
     }

     /**
     ** This function is used to close the popup and set empty for datatable
     */
     assignUserToZoneCancel() {
          this.activePageUnAssignUser = 0;
          this.startForUnassignUser = 0;
          this.pageUnassignUser['size'] = 10;
          this.pageLimitUnassignUsers = this.pageUnassignUser['size'];
          this.searchForUnassignUser = '';
          jQuery("#unassignedUsersToZone-Modal").modal("hide");
     }

     /**
     ** This function is used to close the popup and set empty for datatable
     */
     assignAssetToZoneCancel() {
          this.activePageUnAssignAsset = 0;
          this.startForUnassignAsset = 0;
          this.pageUnassignAsset['size'] = 10;
          this.pageLimitUnassignAssets = this.pageUnassignAsset['size'];
          this.searchForUnassignAsset = '';
          jQuery("#unassignedAssetsToZone-Modal").modal("hide");
     }


     //Search based on username
     updateFilterForUnassignUsers(event) {
          let val = event.target.value.toLowerCase();
          this.startForUnassignUser = 0;
          this.searchForUnassignUser = val;
          this.activePageUnAssignUser = 0;
          this.showUnassignedUsersPopup();
     }

     //No of rows for page pageLimit
     pageLimitForUnassignUsers(num: any) {
          this.activePageUnAssignUser = 0;
          this.pageUnassignUser['size'] = (num);
          this.showUnassignedUsersPopup();
     }

     // Pagination
     setPageForUnassignUsers(event) {
          this.startForUnassignUser = event.offset * 10;
          this.activePageUnAssignUser = event.offset;
          this.showUnassignedUsersPopup();
     }

     // Sorting columns
     onSortForUnassignUsers(event) {
          this.activePageUnAssignUser = 0;
          this.sortColumn = event.column.prop;
          this.sortOrderForUnassignUser = event.newValue;
          this.startForUnassignUser = 0;
          this.showUnassignedUsersPopup();
     }

     //Search based on username
     updateFilterForUnassignAssets(event) {
          let val = event.target.value.toLowerCase();
          this.startForUnassignAsset = 0;
          this.searchForUnassignAsset = val;
          this.activePageUnAssignAsset = 0;
          this.showUnassignedAssetsPopup();
     }

     //No of rows for page pageLimit
     pageLimitForUnassignAssets(num: any) {
          this.activePageUnAssignAsset = 0;
          this.pageUnassignAsset['size'] = (num);
          this.showUnassignedAssetsPopup();
     }

     // onActivateForUsers(event) {
     // }

     // Pagination
     setPageForUnassignAssets(event) {
          this.startForUnassignAsset = event.offset * 10;
          this.activePageUnAssignAsset = event.offset;
          this.showUnassignedAssetsPopup();
     }

     // Sorting columns
     onSortForUnassignAssets(event) {
          this.activePageUnAssignAsset = 0;
          this.sortColumn = event.column.prop;
          this.sortOrderForUnassignAsset = event.newValue;
          this.startForUnassignAsset = 0;
          this.showUnassignedAssetsPopup();
     }


     //Search based on username
     updateFilterForUsers(event) {
          let val = event.target.value.toLowerCase();
          this.startForUsers = 0;
          this.searchForUsers = val;
          this.activePageUsers = 0;
          this.loadUsersData();
     }

     //No of rows for page pageLimit
     pageLimitForUsers(num: any) {
          this.activePageUsers = 0;
          this.pageUsers['size'] = (num);
          this.loadUsersData();
     }

     // Pagination
     setPageForUsers(event) {
          this.startForUsers = event.offset * 10;
          this.activePageUsers = event.offset;
          this.loadUsersData();
     }

     // Sorting columns
     onSortForUsers(event) {
          this.activePageUsers = 0;
          this.sortColumn = event.column.prop;
          this.sortOrderForUsers = event.newValue;
          this.startForUsers = 0;
          this.loadUsersData();
     }

     //Search based on username
     updateFilterForAssets(event) {
          let val = event.target.value.toLowerCase();
          this.startForAssets = 0;
          this.searchForAssets = val;
          this.activePageAssets = 0;
          this.loadAssetsData();
     }

     //No of rows for page pageLimit
     pageLimitForAssets(num: any) {
          this.activePageAssets = 0;
          this.pageAssets['size'] = (num);
          this.loadAssetsData();
     }

     // onActivateForUsers(event) {
     // }

     // Pagination
     setPageForAssets(event) {
          this.startForAssets = event.offset * 10;
          this.activePageAssets = event.offset;
          this.loadAssetsData();
     }

     // Sorting columns
     onSortForAssets(event) {
          this.activePageAssets = 0;
          this.sortColumn = event.column.prop;
          this.sortOrderForAssets = event.newValue;
          this.startForAssets = 0;
          this.loadAssetsData();
     }

     onActivate(event) {
          // this.logger.info('ZONEINFO', 'onActivate', "Activate Event:" + event);
     }
     //on User select
     onUserSelect({ selected }) {
          this.selectedUser = selected;
          this.logger.info('ZONEINFO', 'onUserSelect', 'Selected User Event', selected, JSON.stringify(this.selectedUser));
          //this.selectedUser.splice(0, this.selectedUser.length);
          // this.selectedUser.push(...selectedUser);
     }

     //on asset select
     onAssetSelect({ selected }) {
          this.selectedAsset = selected;
          this.logger.info('ZONEINFO', 'onAssetSelect', 'Selected Asset Event', selected, JSON.stringify(this.selectedAsset));
          //this.selectedUser.splice(0, this.selectedUser.length);
          // this.selectedUser.push(...selectedUser);
     }
}