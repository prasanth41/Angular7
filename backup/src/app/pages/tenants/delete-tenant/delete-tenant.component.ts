import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { TenantsService } from '../../../services/tenants/tenants.service';
import { Session } from '../../../models/Session';

@Component({
  selector: 'app-delete-tenant',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './delete-tenant.component.html'
})
export class DeleteTenantComponent implements OnInit {
  private userEmailToDelete: string = '';
  private tenantName: string = '';
  private session: Session;

  @Output() refresh: EventEmitter<string> = new EventEmitter<string>();

  constructor(private tenantsService: TenantsService, private toastrService: ToastrService, private translate: TranslateService, private logger: NGXLogger) {
  }

  ngOnInit() {
    this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
  }

  // displaying data in delete popup
  public delete(event) {
    this.userEmailToDelete = event.userMail;
    this.tenantName = event.c_name;
  }

  // api call for Tenant deletion
  public deleteTenant() {
    const input = { userToken: this.session.token, userEmailToDelete: this.userEmailToDelete };
    this.tenantsService.deleteTenant(input).subscribe((result: any) => {
      this.logger.info('TENANTS', 'DeleteTenant', "results:" + JSON.stringify(result));
      this.translate.get('TENANTS.SUCCESS.DELETION_SUCCESS').subscribe((res: string) => {
        this.toastrService.success(res, '');
      });
      this.refresh.emit();
    });
  }
}
