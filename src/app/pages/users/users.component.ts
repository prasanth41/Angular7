import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/User';;
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { isBlank } from '../../shared/utils/utils';
import { UsersService } from '../../services/users/users.service';
@Component({
  selector: 'az-users',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {
  userForm: FormGroup;
  private rows: Array<User> = [];
  itemsPerPage = new FormControl('10');
  private page: object = {
    size: this.itemsPerPage.value,
    totalElements: 0,
    pageNumber: 0,
  };
  public loading = false;
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
  private mandatoryOrOptional: string = 'Mandatory';
  private isPasswordMandatory: boolean = true;
  private isGenerateChecked: boolean = true;
  private isShowPasswordChecked: boolean = false;
  private base64textString: string = '';
  private userObjectURI: string = '';
  private file: any;
  private user: any = {
    userRole: 'Admin',
    userStatus: 'Active'
  };
  private isReadOnly: boolean;
  private name;
  private userImage: string = '';

  @ViewChild('showhideinput') input;
  @ViewChild('showconfirmhideinput') confirmInput;
  constructor(private usersService: UsersService, private toastrService: ToastrService, private translate: TranslateService, private formBuilder: FormBuilder, private logger: NGXLogger) {

    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', ''],
      image: [null, ''],
      role: ['', ''],
      status: ['', ''],
      emailPasswordTo: ['', Validators.compose([Validators.required, emailValidator])],
    }, { validator: matchingPasswords('password', 'confirmPassword') })
  }

  ngOnInit() {
    this.loadData();
  }

  //Get Users data
  loadData() {
    this.token = JSON.parse(sessionStorage.getItem('sessionInfo')).token;
    let userMail = JSON.parse(sessionStorage.getItem('sessionInfo')).userMail;
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
    if (!isBlank(this.search)) {
      input.filter.push({
        "key": "s_userMail",
        "value": this.search,
        "filterType": "sw"
      });
    }

    // api call for get users data
    this.loading = true;
    this.usersService.getUsers(input).subscribe((result: any) => {
      this.loading = false;
      this.logger.info('USERS', 'GetUsers', "results:" + JSON.stringify(result));
      let response: boolean = result.returnedValue.status;
      let itemsTotal = result.returnedValue.data.recordsTotal;
      let users: any[] = result.returnedValue.data.records;
      let usersArray: Array<User> = [];
      users.forEach(data => {
        const usersData: User = new User();
        usersData['userName'] = data._customInfo.data.userName;
        console.log(data._customInfo.data)
        usersData['userMail'] = data._customInfo.data.userMail;
        usersData['userRole'] = data._customInfo.userRole;
        usersData['userStatus'] = data._customInfo.userStatus;
        usersData['firstName'] = data._customInfo.firstName;
        usersData['lastName'] = data._customInfo.lastName;
        usersData['phoneNumber'] = data._customInfo.phoneNumber;
        usersData['objectURI'] = data.objectURI;
        usersData['c_image'] = data._customInfo.c_image;
        usersArray.push(usersData);
      });
      this.rows = usersArray;
      console.log(this.rows);
      this.page['pageNumber'] = this.activePage;
      this.page['size'] = this.page['size'];
      this.page['totalElements'] = itemsTotal;
      this.rows.length = itemsTotal;
    }, err => this.loading = false);
  }

  private textChanged(event) {
    this.name = event;
  }

  // add user popup
  add() {
    this.base64textString = '';
    this.file = '';
    this.userImage = '';
    this.isReadOnly = false;
    this.Add_or_Edit_User = 'Add';
    this.userObjectURI = '';
    this.Create_or_Update_User = 'Create';
    this.mandatoryOrOptional = 'Mandatory';
    this.isPasswordMandatory = true;
    this.isGenerateChecked = false;
    this.isShowPasswordChecked = true;
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
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



  // displaying data in Edit User popup
  public edit(event) {
    this.base64textString = '';
    this.file = '';
    this.isReadOnly = true;
    this.Add_or_Edit_User = 'Edit';
    this.Create_or_Update_User = 'Update';
    this.mandatoryOrOptional = 'Optional';
    this.userObjectURI = event.objectURI;
    this.userImage = event.c_image;
    this.isPasswordMandatory = false;
    this.isGenerateChecked = false;
    this.isShowPasswordChecked = true;
    this.userForm = this.formBuilder.group({
      firstName: [event.firstName, Validators.required],
      lastName: [event.lastName, Validators.required],
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

  public editPassword(edit, event) {
    if (edit === "Optional") {
      if (this.userForm.value.password === "") {
      }
    }
  }


  // api call for add and edit user
  onSubmit({ value, valid }: {
    value: {
      email: string;
      password: string;
      confirmPassword: string;
      firstName: string;
      lastName: string;
      role: string;
      status: string,
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
        "c_image": "",
        "userRole": value.role,
        "userStatus": value.status
      },
      "sendMailTo": value.emailPasswordTo,
      "userPassword": value.password,
      "userToken": this.token,
    }
    if (!isBlank(value.phoneNumber)) {
      input['userData'].phoneNumber = value.phoneNumber
    } else {
      input['userData'].phoneNumber = "";
    }


    if (this.Add_or_Edit_User === 'Add') {
      this.logger.info('USERS', 'AddUser', "input:" + JSON.stringify(input));
      this.loading = true
      this.usersService.addUser(input).subscribe((result: any) => {
        this.loading = false;
        this.logger.info('USERS', 'AddUser', "results:" + JSON.stringify(result));
        jQuery("#add_edit-modal").modal("hide");
        this.translate.get('USERS.SUCCESS.CREATION_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '');
        });

        // if (!isBlank(this.base64textString)) {
        //   this._commonUtils.uploadImage({
        //     imageDataUri: this.base64textString,
        //     objectUri: result.returnedValue.data.objectURI,
        //     table: this
        //   }, (response) => {
        //     console.info("add response:" + JSON.stringify(response));
        //     if (response.status) {
        //       this.loadData();
        //     }

        //   });
        // } else { this.loadData(); }
      }, err => this.loading = false);
    } else if (this.Add_or_Edit_User === 'Edit') {
      input["userEmailToUpdate"] = value.email;
      this.logger.info('USERS', 'EditUser', "input:" + JSON.stringify(input));
      this.loading = true;
      this.usersService.updateUser(input).subscribe((result: any) => {
        this.loading = false;
        this.logger.info('USERS', 'EditUser', "results:" + JSON.stringify(result));
        jQuery("#add_edit-modal").modal("hide");
        this.translate.get('USERS.SUCCESS.UPDATION_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '');
        });
        if (!isBlank(this.base64textString)) {
          //   this._commonUtils.uploadImage({
          //     imageDataUri: this.base64textString,
          //     objectUri: this.userObjectURI,
          //     table: this
          //   }, (response) => {
          //     console.info("edit response:" + JSON.stringify(response));
          //     if (response.status) {
          //       this.loadData();
          //     }
          //   });
        } else { this.loadData(); }
      }, err => this.loading = false);
    }
  }

  cancel() {
    jQuery("#add_edit-modal").modal("hide");
  }

  // displaying data in delete popup
  public delete(event) {
    this.userEmailToDelete = event.userMail;
    this.userName = event.userName;
  }

  // api call for user deletion
  public deleteUser() {
    const input = { userToken: this.token, userEmailToDelete: this.userEmailToDelete };
    this.loading = true;
    this.usersService.deleteUser(input).subscribe((result: any) => {
      this.loading = false
      this.logger.info('USERS', 'DeleteUser', "results:" + JSON.stringify(input));
      this.translate.get('USERS.SUCCESS.DELETION_SUCCESS').subscribe((res: string) => {
        this.toastrService.success(res, '');
      });
      jQuery("#delete-modal").modal("hide");
      this.loadData();
    }, err => this.loading = false);
  }


  //Auto Generate password
  public generateRandomPassword() {
    this.isGenerateChecked = !this.isGenerateChecked;
    if (this.isGenerateChecked) {
      let randomPassword: string = Math.random().toString(36).substr(2, 8);
      this.userForm.get('password').setValue(randomPassword);
      this.userForm.get('confirmPassword').setValue(randomPassword);
    } else {
      this.userForm.get('password').setValue('');
      this.userForm.get('confirmPassword').setValue('');
    }
  }

  //Hide show password
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
    this.logger.debug('USERS', 'HandleReaderLoaded', "base64textString" + this.base64textString);
    this.userImage = this.base64textString;
  }

  // removing upload image
  removeFile(): void {
    this.file = '';
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


}

// Email Validation
export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}

// Matching Passwords Validation
export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
    let password = group.controls[passwordKey];
    let passwordConfirmation = group.controls[passwordConfirmationKey];
    if (password.value !== passwordConfirmation.value) {
      return passwordConfirmation.setErrors({ mismatchedPasswords: true })
    }
  }
}
