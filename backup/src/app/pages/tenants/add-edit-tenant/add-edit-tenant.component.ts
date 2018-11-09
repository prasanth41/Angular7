import { Component, OnInit, ViewEncapsulation, ViewChild, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { TenantsService } from '../../../services/tenants/tenants.service';
import { StaticChecks } from '../../../shared/static-data/static-data';
import { isBlank } from '../../../shared/utils/utils';
import { Tenant } from '../../../models/Tenant';
import { Page } from '../../../models/Page';
import { Sort } from '../../../models/Sort';
import { Session } from '../../../models/Session';

@Component({
  selector: 'app-add-edit-tenant',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './add-edit-tenant.component.html'
})
export class AddEditTenantComponent implements OnInit {
  @ViewChild('addEditTenantModal') addEditTenantModal: ModalDirective;
  @ViewChild('search') searchElementRef: ElementRef;
  @ViewChild('showhideinput') input;
  @ViewChild('showconfirmhideinput') confirmInput;

  @Output() refresh: EventEmitter<string> = new EventEmitter<string>();
  map: google.maps.Map;
  private searchControl: FormControl;
  private tenantForm: FormGroup;
  private AddOrEditTenant: string = '';
  private createOrUpdateTenant: string = '';
  private mandatoryOrOptional: string = 'Mandatory';
  private isPasswordMandatory: boolean = true;
  private base64textString: string = '';
  private userObjectURI: string = '';
  private file: any;
  private lat: number;
  private lng: number;
  private c_id: string;
  private isReadOnly: boolean;
  private email;
  private userImage: string = '';
  private session: Session;

  constructor(private tenantsService: TenantsService, private toastrService: ToastrService, private translate: TranslateService, private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private logger: NGXLogger) {
    //load Places Autocomplete
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

    this.tenantForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: '',
      address: '',
      email: ['', Validators.compose([Validators.required, emailValidator])],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
      isGenerateChecked: false,
      isShowPasswordChecked: false,
      emailPasswordTo: ['', Validators.compose([Validators.required, emailValidator])],
    }, { validator: matchingPasswords('password', 'confirmPassword') })
  }

  ngOnInit() {
    this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
  }

  // add Tenant popup
  public add() {
    this.addEditTenantModal.show();
    this.file = '';
    this.userImage = '';
    this.userObjectURI = '';
    this.AddOrEditTenant = 'Add';
    this.createOrUpdateTenant = 'Create';
    this.mandatoryOrOptional = 'Mandatory';
    this.tenantForm.get('password').setValidators([Validators.required]);
    this.tenantForm.get('confirmPassword').setValidators([Validators.required]);
    this.generateRandomPassword();
  }


  // displaying data in Edit tenant popup
  public edit(event) {
    this.addEditTenantModal.show();
    this.file = '';
    this.AddOrEditTenant = 'Edit';
    this.createOrUpdateTenant = 'Update';
    this.mandatoryOrOptional = 'Optional';
    this.c_id = event.c_id;
    this.userObjectURI = event.objectURI;
    this.userImage = event.c_image;
    let input = {
      c_id: event.c_id,
      userToken: this.session.token
    }
    let firstName;
    let lastName;
    this.tenantsService.getTenantDetails(input).subscribe((result: any) => {
      let tenantUsers: any = result.returnedValue.data.userData;
      firstName = tenantUsers['firstName'];
      lastName = tenantUsers['lastName'];
      this.tenantForm.patchValue({
        name: event.c_name,
        image: '',
        address: event.address,
        email: event.userMail,
        firstName: firstName,
        lastName: lastName,
        password: '',
        confirmPassword: '',
        isGenerateChecked: false,
        isShowPasswordChecked: false,
        emailPasswordTo: event.userMail
      });
      this.tenantForm.get('name').disable();
      this.tenantForm.get('password').clearValidators();
      this.tenantForm.get('confirmPassword').clearValidators();
    });
  }


  public hideTenantModal(): void {
    this.addEditTenantModal.hide();
    this.tenantForm.reset();
  }

  // api call for add and edit Tenant
  public onSubmit(data: NgForm): void {
    const value = data.value;
    let input: object = {
      "tenantData": {
        "userMail": value.email.toLowerCase(),
        "c_image": '',
        "firstName": value.firstName,
        "lastName": value.lastName,
        "c_name": value.name,
        "address": value.address,
        "latitude": this.lat,
        "longitude": this.lng,
      },
      "sendMailTo": value.emailPasswordTo,
      "userPassword": value.password,
      "userToken": this.session.token,
    }

    if (this.AddOrEditTenant.toUpperCase() === StaticChecks.add) {
      this.logger.info('TENANTS', 'AddTenant', "input:" + JSON.stringify(input));
      this.tenantsService.addTenant(input).subscribe((result: any) => {
        this.logger.info('TENANTS', 'AddTenant', "results:" + JSON.stringify(result));
        this.addEditTenantModal.hide();
        this.translate.get('TENANTS.SUCCESS.CREATION_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '');
        });
        if (!isBlank(this.base64textString)) {
          // this._commonUtils.uploadImage({
          //   imageDataUri: this.base64textString,
          //   objectUri: result.returnedValue.data.objectURI,
          //   table: this
          // }, (response) => {
          //   this.getTenantsData();
          // });
        } else { this.refresh.emit(); }
      });
    } else if (this.AddOrEditTenant.toUpperCase() === StaticChecks.edit) {
      input["c_id"] = this.c_id;
      this.logger.info('TENANTS', 'EditTenant', "input:" + JSON.stringify(input));
      this.tenantsService.updateTenant(input).subscribe((result: any) => {
        this.logger.info('TENANTS', 'EditTenant', "results:" + JSON.stringify(result));
        this.addEditTenantModal.hide();
        this.translate.get('TENANTS.SUCCESS.UPDATION_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '');
        });
        if (!isBlank(this.base64textString)) {
          //   this._commonUtils.uploadImage({
          //     imageDataUri: this.base64textString,
          //     objectUri: this.userObjectURI,
          //     table: this
          //   }, (response) => {
          //     this.getTenantsData();
          //   });
        } else { this.refresh.emit(); }
      });
    }
  }

  //when text changed in username field then automatically emailPasswordTo should be changed in popup
  private textChanged(event) {
    this.email = event;
  }

  //Auto Generate password
  public generateRandomPassword() {
    this.tenantForm.get('isGenerateChecked').setValue(!this.tenantForm.get('isGenerateChecked').value)
    if (this.tenantForm.get('isGenerateChecked').value) {
      let randomPassword: string = Math.random().toString(36).substr(2, 8);
      this.tenantForm.get('password').setValue(randomPassword);
      this.tenantForm.get('confirmPassword').setValue(randomPassword);
    } else {
      this.tenantForm.get('password').setValue('');
      this.tenantForm.get('confirmPassword').setValue('');
    }
  }

  //Hide show password
  public hideShowPassword() {
    this.tenantForm.get('isShowPasswordChecked').setValue(!this.tenantForm.get('isShowPasswordChecked').value)
    if (this.tenantForm.get('isShowPasswordChecked').value) {
      this.input.nativeElement.type = 'text';
      this.confirmInput.nativeElement.type = 'text';
    } else {
      this.input.nativeElement.type = 'password';
      this.confirmInput.nativeElement.type = 'password';
    }
  }

  //upload image on change
  public fileChange(event) {
    let files = event.target.files;
    let file = files[0];
    if (files && file) {
      this.file = file.name;
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }

  public _handleReaderLoaded(readerEvt) {
    this.base64textString = readerEvt.target.result;
    this.logger.debug('TENANTS', 'HandleReaderLoaded', "base64textString" + this.base64textString);
    this.userImage = this.base64textString;
  }

  // removing upload image
  public removeFile(): void {
    this.file = '';
  }
}

// Email Validation
export function emailValidator(control: FormControl): { [key: string]: any } {
  let emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
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
