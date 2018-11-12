import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, NgForm, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

import { Session } from '../../models/Session';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'az-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NGXLogger]
})
export class LoginComponent implements OnInit {
  private router: Router;
  private route: ActivatedRoute;
  public form: FormGroup;
  private returnUrl: string;
  public loading = false;

  constructor(router: Router, route: ActivatedRoute, fb: FormBuilder, private logger: NGXLogger, private loginService: LoginService) {
    this.router = router;
    this.route = route;
    this.form = fb.group({
      'userMail': ['', Validators.compose([Validators.required, emailValidator])],
      'userPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'pages/dashboard';
  }

  public onSubmit(loginForm: NgForm): void {
    this.logger.debug("Login Information: " + JSON.stringify(loginForm));
    this.loading = true;
    this.loginService.login(loginForm).subscribe((result) => {
      this.loading = false;
      const userInfo = result.returnedValue.data.userData;
      if (!(userInfo._customInfo.isPasswordReset)) {
        const session: Session = {
          token: userInfo._accessToken,
          userName: userInfo._customInfo.userName,
          userMail: userInfo._emailAddress,
          userImage: userInfo._customInfo.c_image,
          userRole: userInfo._customInfo.userRole,
          tenantType: result.returnedValue.data.tenantType,
          tenantId: result.returnedValue.data.tenantId,
          tenantName: result.returnedValue.data.tenantName,
        }
        if (typeof (Storage) !== "undefined")
          sessionStorage.setItem('sessionInfo', JSON.stringify(session));
        this.router.navigate([this.returnUrl]);
      } else {
        // jQuery("#resetPassword-modal").modal("show");
      }
    })

  }
}

export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}
