import { Injectable } from '@angular/core';
import { Color, RGB, HEX } from './app.color';
import 'sass-to-js/js/src/sass-to-js.js';
import { environment } from '../environments/environment';
@Injectable()
export class AppConfig {

  public sassVariables: any;
  public config: any;
  public headers: any;
  public statusArray: any = [];
  public CONFIG_DATA: any;
  public SENSOR_TYPES: any;
  public USER_ROLES: any = {};
  public tenantUserRoles: any = [];
  public dataTypesArray: any = [];
  public RULES;
  constructor() {
    let brandName = environment.brandName;
    let appId = environment.app.id;
    let appKey = environment.app.key;
    let url = environment.app.url;
    let murl = environment.app.murl
    let deploymentUrl = environment.rules.url;
    let rulesurl = environment.rules.url;
    let application = environment.rules.application;
    let repository = environment.rules.repository;
    let rulesPackage = environment.rules.package;
    // let rulesRepo = environment.rules.repo;
    let project = environment.rules.project;
    let service = environment.rules.service;
    let serviceUrl = environment.kafkaUrl;
    let kafkaUrl = environment.kafkaUrl;
    let googleMapKey = environment.googleMapKey;
    let debugEnabled = environment.debugEnabled;

    this.CONFIG_DATA = {
      BRAND_NAME: brandName,
      APP_ID: appId,
      APP_KEY: appKey,
      APP_URL: url,
      Mobile_App_url: murl,
      SERVER_URL: url + "/apps/" + appId + "/server-code/versions/current/",
      SERVER_ROOT_URL: url + '/apps/' + appId + '/',
      KAFKA_SERVER_URL: kafkaUrl + "/apps/" + appId + "/",
      BROADCAST_URL: '//run-east.att.io/1ce9979c48ff8/60b04e64ee05/f1d1cb27ea8213a/in/flow/sendMessage',
      TRUE: true,
      FALSE: false,
    }
    this.headers = {
      'X-Kii-AppID': appId,
      'X-Kii-AppKey': appKey,
      'Content-Type': "application/json",
      'Accept': "application/json"
    }
    this.RULES = {
      DEPLOYED_URL: rulesurl,
      APPLICATION: application,
      UPDATE_CONFIG: '/' + service + '/api/rules/updateConfig',
      RULES_URL_PATTERN: '/' + application + '/' + 'kie-drools-wb.html?standalone=true&path=default://master@' + repository + '/' + project + '/src/main/resources/' + rulesPackage + '/#####.gdst&file_name=#####.gdst',
      RULES_URL: [{
        option: 'CellVoltageRules',
        view: 'Cell Voltage Rules'
      }, {
        option: 'BatteryBankRules',
        view: 'Battery Bank Rules'
      }],
      DEPLOY_URL: '/rest/repositories/' + repository + '/projects/' + project + '/maven/install',
      APPROVED: 'APPROVED'
    }


    this.sassVariables = this.getSassVariables();
    this.config = {
      name: brandName,
      title: 'Battery Monitoring',
      version: '1.0.3',
      colors: {
        main: this.sassVariables['main-color'],
        default: this.sassVariables['default-color'],
        dark: this.sassVariables['dark-color'],
        primary: this.sassVariables['primary-color'],
        info: this.sassVariables['info-color'],
        success: this.sassVariables['success-color'],
        warning: this.sassVariables['warning-color'],
        danger: this.sassVariables['danger-color'],
        sidebarBgColor: this.sassVariables['sidebar-bg-color'],
        gray: this.sassVariables['gray'],
        grayLight: this.sassVariables['gray-light']
      }
    }


    this.tenantUserRoles = [{
      option: 'Admin',
      view: 'Admin'
    }, {
      option: 'Observer',
      view: 'Observer'
    },
    //  {
    //   option: 'User',
    //   view: 'User'
    // },
    {
      option: 'Technician',
      view: 'Technician'
    }];

    this.statusArray = [{
      option: 'All',
      view: 'All'
    }, {
      option: 'OK',
      view: 'OK'
    }, {
      option: 'Warning',
      view: 'Warning'
    }, {
      option: 'Critical',
      view: 'Critical'
    }];

    this.dataTypesArray = [{
      option: 'string',
      view: 'String'
    }, {
      option: 'number',
      view: 'Number'
    }, {
      option: 'date',
      view: 'Date'
    }, {
      option: 'boolean',
      view: 'Boolean'

    }]

    this.USER_ROLES = { tenant: 'Tenant', master: 'Master' }

    this.SENSOR_TYPES = [{
      option: 'Tank Level',
      view: 'Tank Level'
    }, {
      option: 'Temperature',
      view: 'Temperature'
    }, {
      option: 'Fuel',
      view: 'Fuel'
    }, {
      option: 'Movement',
      view: 'Movement'
    }, {
      option: 'Humidity',
      view: 'Humidity'
    }, {
      option: 'Flow Rate',
      view: 'Flow Rate'
    }, {
      option: 'Cell Voltage',
      view: 'Cell Voltage'
    }, {
      option: 'Current',
      view: 'Current'
    }, {
      option: 'Voltage',
      view: 'Voltage'
    }, {
      option: 'Other',
      view: 'Other Type'
    }];
  }


  getSassVariables() {
    let variables = jQuery('body').sassToJs({ pseudoEl: "::after", cssProperty: "content" });
    return variables;
  }

  rgba(color, opacity) {
    if (color.indexOf('#') >= 0) {
      if (color.slice(1).length == 3) {
        color = '#' + color.slice(1) + '' + color.slice(1);
      }
      return new Color(new HEX(color)).setAlpha(opacity).toString();
    }
    else {
      console.log("incorrect color: " + color);
      return 'rgba(255,255,255,0.7)';
    }
  }

}
