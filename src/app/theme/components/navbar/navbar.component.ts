import { Session } from './../../../models/Session';
import { AppComponent } from './../../../app.component';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { AppState } from '../../../app.state';
import { SidebarService } from '../sidebar/sidebar.service';
import { FormGroup, FormControl, AbstractControl, FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
@Component({
    selector: 'az-navbar',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [SidebarService, NavbarService]
})

export class NavbarComponent {

    public isMenuCollapsed: boolean = false;
    public router: Router;
    public returnUrl: string;
    public route: ActivatedRoute;
    public userName: string = "";
    public userImage: string = "";
    public technicianApp = "";
    public demoApp = "";
    public downloadDemoAppApk = "";
    public downloadTechnicianAppApk = "";
    public downloadDemoAppForm: FormGroup;
    public downloadAppForTechnicianForm: FormGroup;
    public session: Session;
    public enableMobileApps: boolean;
    private showTenant: boolean;
    private datapassage: any

    constructor(router: Router, route: ActivatedRoute, public _state: AppState, public _sidebarService: SidebarService, public _navbarService: NavbarService, public toastrService: ToastrService, public formBuilder: FormBuilder, private logger: NGXLogger, private translate: TranslateService) {
        this.router = router;
        this.route = route;
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
        this.downloadDemoAppForm = this.formBuilder.group({
            'phoneNumber': ['', Validators.required]
        }, {});
        this.downloadAppForTechnicianForm = this.formBuilder.group({
            'RTphoneNumber': ['', Validators.required]
        }, {});
        this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
        console.log(this.session);
    }
    ngOnInit(): void {
        // this.logger.info('NAVEBAR', 'ngOnInit', "userName:" + JSON.parse(sessionStorage.getItem('sessionInfo')).userName);
        this.userName = this.session.userName;
        this.userImage = this.session.userImage;
        if (this.session.tenantType === "Master") {
            this.enableMobileApps = false;
            this.showTenant = false;
        } else if (this.session.tenantType === "Tenant") {
            this.enableMobileApps = true;
            this.showTenant = true;
        }
    }


    public showDownloadPopup() {
        this.logger.info('NAVEBAR', 'GetMobileAppUrls', "results:");
        this.downloadDemoAppForm = this.formBuilder.group({
            'phoneNumber': ['', Validators.required]
        }, {});

        this.downloadAppForTechnicianForm = this.formBuilder.group({
            'RTphoneNumber': ['', Validators.required]
        }, {});


        let input = {
            "bucketQuery": {
                "clause": {
                    "type": "all",
                }
            }
        };
        this._navbarService.getMobileAppUrls(input).subscribe((result: any) => {
            this.logger.info('NAVEBAR', 'GetMobileAppUrls', "results:" + JSON.stringify(result));
            this.technicianApp = result.results[0].technicianApp;
            this.demoApp = result.results[0].demoApp;
            this.datapassage = { "demoapp": this.demoApp, "technicianApp": this.technicianApp };
        });

    }

    public downloadDemoApp() {
        this.downloadDemoAppApk = this.demoApp;
    };

    public downloadTechnicianApp() {
        this.downloadTechnicianAppApk = this.technicianApp;
    };


    public sendLinkForDemoApp(event) {
        var data = {
            message: 'Download demo app here. \n' + this.demoApp,
            number: '+' + event.value.phoneNumber
        };
        this.logger.info('NAVEBAR', 'SendLinkForDemoApp', "input:" + JSON.stringify(data));
        this._navbarService.sendLink(data).subscribe((response: any) => {
            this.logger.info('NAVEBAR', 'SendLinkForDemoApp', "results:" + JSON.stringify(response));
            var sent = response.sent;
            var failed = response.failed;
            if (sent.length !== 0 && failed.length === 0) {
                this.translate.get('Menu.SENT_LINK').subscribe((res: string) => {
                    this.toastrService.success(res, '');
                });
            } else if (sent.length === 0 && failed.length !== 0) {
                this.translate.get('Menu.FAIL_TO_SEND_LINK').subscribe((res: string) => {
                    this.toastrService.error(res, '');
                });
            }
        });
    };

    public sendLinkForTechnicianApp(event) {
        var data = {
            message: 'Download tech app here. \n' + this.technicianApp,
            number: '+' + event.value.RTphoneNumber
        };

        this.logger.info('NAVEBAR', 'sendLinkForTechnicianApp', "input:" + JSON.stringify(data));
        this._navbarService.sendLink(data).subscribe((response: any) => {
            this.logger.info('NAVEBAR', 'SendLinkForTechnicianApp', "results:" + JSON.stringify(response));
            var sent = response.sent;
            var failed = response.failed;
            if (sent.length !== 0 && failed.length === 0) {

                this.translate.get('Menu.SENT_LINK').subscribe((res: string) => {
                    this.toastrService.success(res, '');
                });

            } else if (sent.length === 0 && failed.length !== 0) {
                this.translate.get('Menu.FAIL_TO_SEND_LINK').subscribe((res: string) => {
                    this.toastrService.error(res, '');
                });
            }
        });
    };


    public closeSubMenus() {
        /* when using <az-sidebar> instead of <az-menu> uncomment this line */
        // this._sidebarService.closeAllSubMenus();
    }
    public logout() {
        sessionStorage.removeItem('sessionInfo');
        sessionStorage.clear();
        this.router.navigate(['/login']);
    }
    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    }

}
