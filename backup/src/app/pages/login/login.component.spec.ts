import { TestBed, ComponentFixture, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginService } from '../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';

describe('LoginComponent', () => {

  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        SharedModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [LoginService, ToastrService]
    }).compileComponents();

    // create component and test fixture
    fixture = TestBed.createComponent(LoginComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    service = TestBed.get(LoginService);

    component.ngOnInit();

  });

  it('email field validity', () => {
    let email = component.form.controls['userMail'];
    expect(email.valid).toBeFalsy();
  });

  it('email field pattern validity', () => {
    let errors = {};
    let email = component.form.controls['userMail'];
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['invalidEmail']).toBeTruthy();
  });

  it('password field validity', () => {
    let password = component.form.controls['userPassword'];
    expect(password.valid).toBeFalsy();
  });

  it('password field min length validity', () => {
    let errors = {};
    let password = component.form.controls['userPassword'];
    password.setValue("abc");
    errors = password.errors || {};
    expect(errors['minlength']).toBeTruthy();
  });

  it('checking form validity', () => {
    expect(component.form.valid).toBeFalsy();
    component.form.controls['userMail'].setValue("admin@demogroup.com");
    component.form.controls['userPassword'].setValue("1234");
    expect(component.form.valid).toBeTruthy();
  });

});
