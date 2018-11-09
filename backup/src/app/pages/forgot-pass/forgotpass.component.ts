import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, NgForm, Validators } from '@angular/forms';
import { Session } from '../../models/Session';
import { ForgotPassService } from '../../services/forgot-pass/forgot-pass.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Component({
     selector: 'az-forgot-pass',
     encapsulation: ViewEncapsulation.None,
     templateUrl: './forgotpass.component.html',
     styleUrls: ['./forgotpass.component.scss'],
     providers: [ForgotPassService]
})
export class ForgotPassComponent implements OnInit {
     private router: Router;
     private route: ActivatedRoute;
     public forgotPasswordForm: FormGroup;
     public email: AbstractControl;

     constructor(router: Router, route: ActivatedRoute, fb: FormBuilder, private toastrService: ToastrService, private translate: TranslateService, private forgotPassService: ForgotPassService) {
          this.router = router;
          this.route = route;
          this.forgotPasswordForm = fb.group({
               'email': ['', Validators.compose([Validators.required, emailValidator])],
          });
          this.email = this.forgotPasswordForm.controls['email'];
     }

     ngOnInit() {
     }

     private forgotPassword(forgotpwd) {
          console.log(forgotpwd);
          let input = {
               'userMail': forgotpwd.email
          }
          this.forgotPassService.forgotPassword(input).subscribe((result: any) => {
               console.log(result.returnedValue.status == false);
               if (result.returnedValue.status) {
                    this.translate.get('PASSWORD_RESET.SUCCESS.PASSWORD_UPDATE_SUCCESS').subscribe((res: string) => {
                         this.toastrService.success(res, '');
                    })
               } else {
                    this.translate.get('PASSWORD_RESET.FAILED.PASSWORD_UPDATE_FAILED_NOT_EXISTS').subscribe((res: string) => {
                         this.toastrService.error(res, '');
                    });
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