import { Session } from './../../models/Session';
import { Inject, forwardRef, Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, NgModule, NgZone } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { UsersService } from './../../services/users/users.service';
import { SettingService } from './../../services/settings/settings.service';
import { isValid, uploadImage } from './../../shared/utils/utils';
import { NavbarComponent } from '../../theme/components/navbar/navbar.component';
import { SidebarService } from './../../theme/components/sidebar/sidebar.service';
import { NavbarService } from './../../services/navbar/navbar.service';

@Component({
     selector: 'az-settings',
     encapsulation: ViewEncapsulation.None,
     templateUrl: './settings.component.html',
     providers: [SettingService, UsersService, NavbarComponent, SidebarService, NavbarService],
})
export class SettingsComponent {
     itemsPerPage = new FormControl('10');
     private token = '';
     private userMail = '';
     private base64textString: string = '';
     private userObjectURI: string = '';
     private file: any;
     private session: Session;
     userForm: FormGroup;
     securityForm: FormGroup;
     private userImage: string = '';
     constructor(@Inject(forwardRef(() => NavbarComponent)) private _parent: NavbarComponent, private translate: TranslateService, private _settingsService: SettingService, private _usersService: UsersService, private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader,
          private logger: NGXLogger, private ngZone: NgZone, public toastrService: ToastrService) {
          this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
          this.token = this.session.token;
          this.userMail = this.session.userMail;
          this.userForm = this.formBuilder.group({
               firstName: ['', Validators.required],
               lastName: ['', Validators.required],
               email: ['', Validators.compose([Validators.required, emailValidator])],
               mobileNumber: ['', ''],
               image: [null, ''],
               role: ['', ''],
          }, {});
          this.securityForm = this.formBuilder.group({
               email: ['', Validators.compose([Validators.required, emailValidator])],
               currentPassword: ['', Validators.required],
               password: ['', Validators.required],
               confirmPassword: ['', Validators.required]
          }, { validator: matchingPasswords('password', 'confirmPassword') })
     }

     ngOnInit(): void {
          this.getUserDetails();
     }

     public onTabChangeSettings(tab) {
          if (tab.id === 'tab-profile') {
               this.getUserDetails();
          } else if (tab.id === 'tab-security') {
               this.getUserDetails();
          }
     };
     getUserDetails() {
          var input = {
               userToken: this.token,
               filter: [{
                    key: 's_userMail',
                    value: this.userMail,
                    filterType: 'eq'
               }]
          };
          this._usersService.getUsers(input).subscribe((result: any) => {
               let userProfile = result.returnedValue.data.records[0]._customInfo;
               this.userObjectURI = result.returnedValue.data.records[0].objectURI;
               this.userImage = userProfile.c_image;
               this.userForm = this.formBuilder.group({
                    firstName: [userProfile.data.firstName, Validators.required],
                    lastName: [userProfile.data.lastName, Validators.required],
                    email: [userProfile.s_userMail, Validators.compose([Validators.required, emailValidator])],
                    mobileNumber: [userProfile.data.phoneNumber, ''],
                    image: ['', ''],
                    role: [userProfile.userRole, ''],
               }, {})

               this.securityForm = this.formBuilder.group({
                    email: [userProfile.s_userMail, Validators.compose([Validators.required, emailValidator])],
                    currentPassword: ['', Validators.required],
                    password: ['', ''],
                    confirmPassword: ['', ''],
               }, { validator: matchingPasswords('password', 'confirmPassword') })
          })
     }
     /**
** This function is used to call api for add,edit user
*/
     updateUserAdvanced({ value, valid }: {
          value: {
               email: string;
               firstName: string;
               lastName: string;
               role: string;
               mobileNumber: string;
          }, valid: boolean
     }) {
          let input: object = {
               "userData": {
                    "firstName": value.firstName,
                    "lastName": value.lastName,
                    "userStatus": "Active",
                    "userRole": value.role,
               },
               "userToken": this.token,
          }
          if (isValid(value.mobileNumber)) {
               input['userData'].phoneNumber = value.mobileNumber
          } else {
               input['userData'].phoneNumber = "";
          }
          input["userEmailToUpdate"] = value.email;
          this._usersService.updateUser(input).subscribe((result: any) => {
               this.translate.get('PROFILE.SUCCESS.UPDATION_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(res, '');
               });
               let userName = value.firstName + ' ' + value.lastName;
               if (isValid(this.base64textString)) {
                    this.logger.debug('SETTINGS', 'UpdateUser', "Upload Image");
                    uploadImage({
                         imageDataUri: this.base64textString,
                         objectUri: this.userObjectURI,
                         profile: userName
                         // table: this
                    }, (response) => {
                         this.logger.debug('SETTINGS', 'UpdateUser', "response");
                         if (response.status) {
                              this._parent.ngOnInit();
                              this.getUserDetails();
                         }
                    });
               } else {
                    var obj = {
                         token: sessionStorage.getItem('_accessToken'),
                         userName: userName,
                         userMail: JSON.parse(sessionStorage.getItem('sessionInfo')).userMail,
                         userImage: JSON.parse(sessionStorage.getItem('sessionInfo')).userImage,
                         userRole: JSON.parse(sessionStorage.getItem('sessionInfo')).userRole,
                         tenantType: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantType,
                         tenantId: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantId,
                         tenantName: JSON.parse(sessionStorage.getItem('sessionInfo')).tenantName
                    }
                    sessionStorage.setItem('sessionInfo', JSON.stringify(obj));
                    this._parent.ngOnInit();
                    this.getUserDetails();
               }
          });
     }

     //upload image on change
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
          this.logger.debug('SETTINGS', 'HandleReaderLoaded', "base64textString" + this.base64textString);
          this.userImage = this.base64textString;
     }

     // removing upload image
     removeFile(): void {
          this.file = '';
     }

     /**
     ** This function is used for reset password
     */
     resetPassword({ value, valid }: {
          value: {
               currentPassword: string;
               confirmPassword: string;
               password: string;
               role: string;
          }, valid: boolean
     }) {
          var input = {
               userToken: this.token,
               oldPassword: value.currentPassword,
               newPassword: value.confirmPassword,
          };
          this._settingsService.resetPassword(input).subscribe((result: any) => {
               this.translate.get('PROFILE.SUCCESS.UPDATION_SUCCESS').subscribe((res: string) => {
                    this.toastrService.success(res, '');
               });
               jQuery("#sessionExpired-modal").modal("show");

          });
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