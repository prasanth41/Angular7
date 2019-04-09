import { Component, ViewEncapsulation } from '@angular/core';
import { AppConfig } from './app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'az-root',
  encapsulation: ViewEncapsulation.None,
  template: `<router-outlet></router-outlet>
  <az-loader></az-loader>
  <div class="modal fade" id="sessionExpired-modal" tabindex="-1" role="dialog" aria-labelledby="modal-label"
  data-backdrop="static" data-keyboard="false" style="display: none;">
  <div class="modal-dialog modal-md" role="document"> <div class="modal-content">
   <div class="modal-header text-center"> <h4 class="modal-title custom-font" id="modal-label">
   <strong>Session</strong>&nbsp;Expired</h4> </div> <div class="modal-body text-center">
    <p><strong>Your session has expired. Please log in again</strong></p>
    </div> <div class="modal-footer">
    <button type="button" class="btn btn-success btn-sm" (click)="sessionPromptClose()">
    <i class="fa fa-arrow-right"></i> OK</button> </div> </div> </div> </div>`,
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  private userName: string = "";
  constructor(private router: Router, private translate: TranslateService) {
    // this.userName = JSON.parse(sessionStorage.getItem('sessionInfo')).userName;
    translate.addLangs(["en", "fr"]);
    translate.setDefaultLang('en');

    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  public sessionPromptClose() {
    jQuery("#sessionExpired-modal").modal("hide");
    sessionStorage.removeItem('sessionInfo');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}