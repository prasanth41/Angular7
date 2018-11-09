import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { TenantsService } from '../../services/tenants/tenants.service';
import { StaticChecks } from '../../shared/static-data/static-data';
import { isBlank } from '../../shared/utils/utils';
import { Tenant } from '../../models/Tenant';
import { Page } from '../../models/Page';
import { Sort } from '../../models/Sort';
import { Session } from '../../models/Session';

@Component({
  selector: 'az-tenants',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tenants.component.html'
})
export class TenantsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private rows: Array<Tenant> = [];
  private itemsPerPage = new FormControl('10');
  private page: Page = {
    size: this.itemsPerPage.value,
    totalElements: 0,
    pageNumber: 0,
  };
  private sort: Sort = {
    prop: 'c_name',
    dir: 'asc'
  };
  private nextPageKey: string = '200/';
  private start: number = 0;
  private search: string = '';
  private session: Session;

  constructor(private tenantsService: TenantsService, private logger: NGXLogger) {
  }

  ngOnInit() {
    this.session = JSON.parse(sessionStorage.getItem('sessionInfo'));
    this.getTenantsData();
  }

  //Get Tenants Data
  public getTenantsData() {
    const nextPaginationKey = this.nextPageKey + this.page.pageNumber * this.page.size;
    const input = {
      order: { "dir": this.sort.dir, "column": this.sort.prop },
      start: this.start,
      length: this.page['size'],
      userToken: this.session.token,
      nextPaginationKey: nextPaginationKey,
      filter: []
    };
    if (!isBlank(this.search)) {
      input.filter.push({
        "key": "s_name",
        "value": this.search,
        "filterType": "sw"
      });
    }

    // api call for get Tenants data
    this.tenantsService.getTenants(input).subscribe((result: any) => {
      // this.logger.info('TENANTS', 'GetTenants', "results:" + JSON.stringify(result));
      const response: boolean = result.returnedValue.status;
      const itemsTotal = result.returnedValue.data.recordsTotal;
      const tenants: any[] = result.returnedValue.data.records;
      const tenantsArray: Array<Tenant> = [];
      tenants.forEach(data => {
        const tenantsData: Tenant = new Tenant();
        tenantsData['c_id'] = data._customInfo.c_id;
        tenantsData['c_name'] = data._customInfo.c_name;
        tenantsData['userMail'] = data._customInfo.userMail;
        tenantsData['address'] = data._customInfo.address;
        tenantsData['objectURI'] = data.objectURI;
        tenantsData['c_image'] = data._customInfo.c_image;
        tenantsArray.push(tenantsData);
      });
      this.rows = tenantsArray;
      this.page['totalElements'] = itemsTotal;
      this.rows.length = itemsTotal;
    });
  }

  //Search based on tenantName
  public updateFilter(event) {
    this.search = event.target.value.toLowerCase();
    this.table.offset = 0;
    this.getTenantsData();
  }

  //No. of rows for page pageLimit
  public updatePageLimit(num: any) {
    this.page.size = (num);
    this.getTenantsData();
  }

  // Pagination
  public setPage(event) {
    this.start = event.offset * this.page.size;
    this.page.pageNumber = event.offset;
    this.getTenantsData();
  }

  // Sorting columns
  public onSort(event) {
    this.sort = event.sorts[0];
    this.getTenantsData();
  }

}
