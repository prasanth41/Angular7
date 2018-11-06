import { Injectable } from '@angular/core';
import { masterItems, tenantItems } from './menu';

@Injectable()
export class MenuService {

  public getMasterItems(): Array<Object> {
    return masterItems;
  }

  public getTenantItems(): Array<Object> {
    return tenantItems;
  }

}
