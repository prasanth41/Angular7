import { Session } from '../../models/Session';
import { TenantUser } from '../../models/tenant-user';
import { AppConfig } from '../../app.config';
import { UsersService } from '../../services/users/users.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { isValid, uploadImage } from '../../shared/utils/utils';
@Component({
     selector: 'az-tenantUsers',
     encapsulation: ViewEncapsulation.None,
     providers: [UsersService],
     templateUrl: './tenant-users.component.html'
})

export class TenantUsersComponent implements OnInit {
     public tenantUserForm: FormGroup;
     private rows: Array<TenantUser> = [];
     itemsPerPage = new FormControl('10');
     private page: object = {
          size: this.itemsPerPage.value,
          totalElements: 0,
          pageNumber: 0,
     };
     private nextPageKey: string = '200/';
     private activePage: number = 0;
     private start: number = 0;
     private search: string = '';
     private sortOrder: string = 'asc';
     private sortColumn: string = 'userMail';
     private token: string = '';
     private userEmailToDelete: string = '';
     private userName: string = '';
     private Add_or_Edit_User: string = '';
     private Create_or_Update_User: string = '';
     private mandatory_or_optional: string = 'Mandatory';
     private isPasswordMandatory: boolean = true;
     private isGenerateChecked: boolean = false;
     private isShowPasswordChecked: boolean = false;
     private base64textString: string = '';
     private userObjectURI: string = '';
     private file: any;
     private user: any = {
          userRole: 'Admin',
          userStatus: 'Active'
     };
     private lat: number;
     private lng: number;
     private tenantUserRoles = [];
     private isReadOnly: boolean;
     private name;
     private userImage: string = '';

     @ViewChild("search")
     private searchElementRef: ElementRef;
     private session: Session;
     @ViewChild('showhideinput') input;
     @ViewChild('showconfirmhideinput') confirmInput;
     constructor(private _usersService: UsersService, fb: FormBuilder, private toastrService: ToastrService, private translate: TranslateService, private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader,
          private ngZone: NgZone, private _appConfig: AppConfig, private logger: NGXLogger) {
          this.tenantUserRoles = this._appConfig.tenantUserRoles;
          this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
          this.tenantUserForm = this.formBuilder.group({
               firstName: ['', Validators.required],
               lastName: ['', Validators.required],
               email: ['', Validators.compose([Validators.required, emailValidator])],
               password: ['', Validators.required],
               confirmPassword: ['', Validators.required],
               address: ['', Validators.required],
               phoneNumber: ['', ''],
               image: [null, ''],
               role: ['', ''],
               status: ['', ''],
               emailPasswordTo: ['', Validators.compose([Validators.required, emailValidator])],
          }, { validator: matchingPasswords('password', 'confirmPassword') })
     }

     ngOnInit() {
          this.mapsAPILoader.load().then(() => {
               let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                    types: ["address"]
               });
               autocomplete.addListener("place_changed", () => {
                    this.ngZone.run(() => {
                         //get the place result
                         let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                         //verify result
                         if (place.geometry === undefined || place.geometry === null) {
                              return;
                         }
                         //set latitude, longitude and zoom
                         this.lat = place.geometry.location.lat();
                         this.lng = place.geometry.location.lng();
                    });
               });
          });
          this.loadData();
     }

     public loadData() {
          this.token = this.session.token;
          let userMail = this.session.userMail;
          let nextPaginationKey = this.nextPageKey + this.activePage * this.page['size'];
          let input = {
               'order': { "dir": this.sortOrder, "column": this.sortColumn },
               "start": this.start,
               'length': this.page['size'],
               'userToken': this.token,
               'nextPaginationKey': nextPaginationKey,
               "filter": [
                    {
                         "key": "s_userMail",
                         "value": userMail,
                         "filterType": "neq"
                    }
               ]
          };

          if (isValid(this.search)) {
               input.filter.push({
                    "key": "s_userMail",
                    "value": this.search,
                    "filterType": "sw"
               });
          }
          this._usersService.getUsers(input).subscribe((result: any) => {
               this.logger.info('TENANTUSERS', 'GetTenantUsers', "results:" + JSON.stringify(result));
               this.logger.info('TENANTUSERS', 'GetTenantUsers', "results:" + JSON.stringify(result));
               let response: boolean = result.returnedValue.status;
               let itemsTotal = result.returnedValue.data.recordsTotal;
               let users: any[] = result.returnedValue.data.records;
               let usersArray: Array<TenantUser> = [];
               users.forEach(data => {
                    const usersData: TenantUser = new TenantUser();
                    usersData['userName'] = data._customInfo.data.userName;
                    usersData['userMail'] = data._customInfo.s_userMail;
                    usersData['userRole'] = data._customInfo.userRole;
                    usersData['userStatus'] = data._customInfo.userStatus;
                    usersData['firstName'] = data._customInfo.data.firstName;
                    usersData['lastName'] = data._customInfo.data.lastName;
                    usersData['phoneNumber'] = data._customInfo.phoneNumber;
                    usersData['objectURI'] = data.objectURI;
                    usersData['c_image'] = data._customInfo.c_image;
                    usersArray.push(usersData);
               });
               this.rows = usersArray;
               this.page['pageNumber'] = this.activePage;
               this.page['size'] = this.page['size'];
               this.page['totalElements'] = itemsTotal;
               this.rows.length = itemsTotal;
          })
     }

     //For username and emailPasswordTo
     private textChanged(event) {
          this.name = event;
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

     /**
     ** This function is used for add user
     */
     add() {
          this.file = '';
          this.userImage = '';
          this.isReadOnly = false;
          this.Add_or_Edit_User = 'Add';
          this.userObjectURI = '';
          this.Create_or_Update_User = 'Create';
          this.mandatory_or_optional = 'Mandatory';
          this.isPasswordMandatory = true;
          this.isGenerateChecked = false;
          this.isShowPasswordChecked = true;
          this.tenantUserForm = this.formBuilder.group({
               firstName: ['', Validators.required],
               lastName: ['', Validators.required],
               email: ['', Validators.compose([Validators.required, emailValidator])],
               password: ['', Validators.required],
               address: ['', ''],
               confirmPassword: ['', Validators.required],
               phoneNumber: ['', ''],
               image: ['', ''],
               role: [this.user.userRole, ''],
               status: [this.user.userStatus, ''],
               emailPasswordTo: ['', Validators.compose([Validators.required, emailValidator])],
          }, { validator: matchingPasswords('password', 'confirmPassword') })
          this.generateRandomPassword();
          this.hideShowPassword();
     }

     /**
     ** This function is used for displaying data in edit user
     */
     public edit(event) {
          this.file = '';
          this.isReadOnly = true;
          this.Add_or_Edit_User = 'Edit';
          this.Create_or_Update_User = 'Update';
          this.mandatory_or_optional = 'Optional';
          this.isPasswordMandatory = false;
          this.isGenerateChecked = false;
          this.isShowPasswordChecked = true;
          this.userObjectURI = event.objectURI;
          this.userImage = event.c_image;
          this.tenantUserForm = this.formBuilder.group({
               firstName: [event.firstName, Validators.required],
               lastName: [event.lastName, Validators.required],
               address: [event.userAddress, ''],
               email: [event.userMail, Validators.compose([Validators.required, emailValidator])],
               password: ['', ''],
               confirmPassword: ['', ''],
               phoneNumber: [event.phoneNumber, ''],
               image: ['', ''],
               role: [event.userRole, ''],
               status: [event.userStatus, ''],
               emailPasswordTo: [event.userMail, Validators.compose([Validators.required, emailValidator])],
          }, { validator: matchingPasswords('password', 'confirmPassword') })
          this.hideShowPassword();
     }

     /**
     ** This function is used to call api for add,edit user
     */
     onSubmit({ value, valid }: {
          value: {
               email: string;
               password: string;
               confirmPassword: string;
               firstName: string;
               lastName: string;
               role: string;
               status: string,
               address: string;
               emailPasswordTo: string;
               image: string;
               phoneNumber: string;
          }, valid: boolean
     }) {
          let input: object = {
               "userData": {
                    "userMail": value.email.toLowerCase(),
                    "firstName": value.firstName,
                    "lastName": value.lastName,
                    "c_image": '',
                    "userAddress": value.address,
                    "userRole": value.role,
                    "userStatus": value.status,
               },
               "sendMailTo": value.emailPasswordTo,
               "userPassword": value.password,
               "userToken": this.token,
          }
          if (isValid(value.phoneNumber)) {
               input['userData'].phoneNumber = value.phoneNumber
          } else {
               input['userData'].phoneNumber = "";
          }

          if (this.Add_or_Edit_User === 'Add') {
               this.logger.info('TENANTUSERS', 'AddUser', "input:" + JSON.stringify(input));
               this._usersService.addUser(input).subscribe((result: any) => {
                    this.logger.info('TENANTUSERS', 'AddUser', "results:" + JSON.stringify(result));
                    jQuery("#add_edit-modal").modal("hide");
                    this.translate.get('USERS.SUCCESS.CREATION_SUCCESS').subscribe((res: string) => {
                         this.toastrService.success(res, '');
                    });

                    if (isValid(this.base64textString)) {
                         uploadImage({
                              imageDataUri: this.base64textString,
                              objectUri: result.returnedValue.data.objectURI,
                              table: this
                         }, (response) => {
                              this.loadData();
                         });
                    } else { this.loadData(); }
               });
          } else if (this.Add_or_Edit_User === 'Edit') {
               input["userEmailToUpdate"] = value.email;
               this.logger.info('TENANTUSERS', 'EditUser', "input:" + JSON.stringify(input));
               this._usersService.updateUser(input).subscribe((result: any) => {
                    this.logger.info('TENANTUSERS', 'EditUser', "results:" + JSON.stringify(result));
                    jQuery("#add_edit-modal").modal("hide");
                    this.translate.get('USERS.SUCCESS.UPDATION_SUCCESS').subscribe((res: string) => {
                         this.toastrService.success(res, '');
                    });
                    if (isValid(this.base64textString)) {
                         this.logger.info('TENANTUSERS', 'EditUser', "Upload Image");
                         uploadImage({
                              imageDataUri: this.base64textString,
                              objectUri: this.userObjectURI,
                              table: this
                         }, (response) => {
                              this.loadData();
                         });
                    } else { this.loadData(); }
               });
          }
     }

     /**
     ** This function is used for displaying data in delete popup
     */
     public delete(event) {
          this.userEmailToDelete = event.userMail;
          this.userName = event.userName;
     }

     /**
     ** This function is used for delete user
     */
     public deleteUser() {
          let input: any = { userToken: this.token, userEmailToDelete: this.userEmailToDelete };
          this._usersService.deleteUser(input).subscribe((result: any) => {
               this.logger.info('TENANTUSERS', 'DeleteUser', "results:" + JSON.stringify(input));
               this.translate.get('USERS.SUCCESS.DELETION_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(res, '');
               });
               jQuery("#delete-modal").modal("hide");
               this.loadData();
          });
     }

     /**
     ** This function is used for auto generate password
     */
     public generateRandomPassword() {
          this.isGenerateChecked = !this.isGenerateChecked;
          if (this.isGenerateChecked) {
               let randomPassword: string = Math.random().toString(36).substr(2, 8);
               this.tenantUserForm.get('password').setValue(randomPassword);
               this.tenantUserForm.get('confirmPassword').setValue(randomPassword);
          } else {
               this.tenantUserForm.get('password').setValue('');
               this.tenantUserForm.get('confirmPassword').setValue('');
          }
     }

     /**
     ** This function is used for show,hide password
     */
     public hideShowPassword() {
          this.isShowPasswordChecked = !this.isShowPasswordChecked;
          if (this.isShowPasswordChecked) {
               this.input.nativeElement.type = 'text';
               this.confirmInput.nativeElement.type = 'text';
          } else {
               this.input.nativeElement.type = 'password';
               this.confirmInput.nativeElement.type = 'password';
          }
     }

     /**
     ** This function is used for upload image on change
     */
     fileChange(event) {
          let files = event.target.files;
          let file = files[0];
          if (files && file) {
               this.file = file.name;
               let reader = new FileReader();
               reader.onload = this._handleReaderLoaded.bind(this);
               reader.readAsDataURL(file);
          }
     }

     _handleReaderLoaded(readerEvt) {
          this.base64textString = readerEvt.target.result;
          this.logger.debug('TENANT-USERS', 'HandleReaderLoaded', "base64textString" + this.base64textString);
          this.userImage = this.base64textString;
     }

     /**
     ** This function is used for removing upload image
     */
     removeFile(): void {
          this.file = '';
     }

}
/**
** This function is used for validating the email.
*/
export function emailValidator(control: FormControl): { [key: string]: any } {
     var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
     if (control.value && !emailRegexp.test(control.value)) {
          return { invalidEmail: true };
     }
}

/**
** This function is used for matching password validation.
*/
export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
     return (group: FormGroup) => {
          let password = group.controls[passwordKey];
          let passwordConfirmation = group.controls[passwordConfirmationKey];
          if (password.value !== passwordConfirmation.value) {
               return passwordConfirmation.setErrors({ mismatchedPasswords: true })
          }
     }
}
