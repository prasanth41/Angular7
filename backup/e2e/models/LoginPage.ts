import { browser, by, element } from 'protractor';
import { setName } from '../util/utils'
//let data = require('../resources/inputdata.json');
let locator = require('../resources/locators.json');
//let lang = require('../src/assets/i18n/en.json');
export class LoginPage {

  navigateTo() {
    return browser.get('/login');
  }

  fillCredentials(credentials: any) {

    element(by.css('[name="userMail"]')).sendKeys(credentials.username);
    element(by.css('[name="userPassword"]')).sendKeys(credentials.password);
    element(by.css('.btn-primary')).click();
  }

  getPageTitleText() {

    return element(by.css('az-login h6')).getText();
    //return element(by.css('card-title')).getText();

  }

  getErrorMessage() {
    return element(by.css('.toast-message')).getText();
  }

}
