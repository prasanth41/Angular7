import { HttpClient } from '@angular/common/http';
import { Session } from './../../models/Session';
import { AppConfig } from './../../app.config';
import { BusinessRulesService } from './../../services/business-rules/business-rules.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SafeResourceUrl, DomSanitizer, SafeHtml, SafeUrl, SafeStyle, SafeScript } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

@Component({
     selector: 'az-businessRules',
     encapsulation: ViewEncapsulation.None,
     templateUrl: './business-rules.component.html',
     providers: [BusinessRulesService],
})

@Pipe({
     name: 'trustAsResourceUrl'
})

export class BusinessRulesComponent implements OnInit {
     private token: string = '';
     private options: any = [];
     private rulesKeys;
     private rules;
     private businessRulesUrl: SafeResourceUrl;
     private CONFIG_DATA;
     private RULES: any;
     private iframe;
     private session: Session
     constructor(private http: HttpClient, private translate: TranslateService, private _appConfig: AppConfig, private toastrService: ToastrService, private _businessRulesService: BusinessRulesService, private sanitizer: DomSanitizer, private logger: NGXLogger) {
          this.session = JSON.parse(sessionStorage.getItem('sessionInfo'))
          this.token = this.session.token;
          this.options = this._appConfig.RULES.RULES_URL;
          this.rules = this.options[0].option;
          this.CONFIG_DATA = this._appConfig.CONFIG_DATA;
          this.RULES = this._appConfig.RULES;
          this.rulesKeys = Object
               .keys(this.options);
     }
     ngOnInit() {
          this.changeRules();
     }
     public changeRules() {
          let input = {
               'userToken': this.token,
          };
          this._businessRulesService.isValidToken(input).subscribe((result: any) => {
               this.rulesKeys.forEach(data => {
                    var id = this.rulesKeys[data];
                    var rule = this.options[id];
                    if (this.rules === rule.option) {
                         this.businessRulesUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.RULES.DEPLOYED_URL + (this.RULES.RULES_URL_PATTERN).replace(/#####/g, rule.option) + '&token=' + this.token + '&appID=' + this.CONFIG_DATA.APP_ID + '&appKey=' + this.CONFIG_DATA.APP_KEY);
                         this.logger.info('BUSINESS_RULES_COMPLETE', 'URL', "results:" + this.businessRulesUrl);
                    }
               });
          }, err => {});
     }

     public deployRules = function () {
          this._businessRulesService.deployAndUpdateRules().subscribe((result: any) => {
               this.logger.info('Deploy and Update', 'DeployAndUpdateRules', "results:" + JSON.stringify(result));

               if (result.returnedValue.status == true) {
                    this.toastrService.success('Deployed successfully', '');

               } else {
                    this.toastrService.error('Failed to Deploy Rules', '');
               }

          }, err =>{});
     }
}