import { browser } from 'protractor';
import { LoginPage } from '../models/LoginPage';
let data = require('../resources/inputdata.json');
let lang = require('../../src/assets/i18n/en.json');
//let lang = require('../src/assets/i18n/en.json');
describe('Authentication capabilities', () => {

  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
    page.navigateTo();
  });

  // it('Verifying page title', () => {
  //   expect(page.getPageTitleText()).toContain('LOGIN TO CONTINUE');
  // });

  it('when user trying to login with wrong credentials he should stay on “login” page and see error notification', () => {
    page.fillCredentials(data.wrongCredentias);
    expect(page.getPageTitleText()).toContain('LOGIN TO CONTINUE');
    //page.getPageTitleText();
    expect(page.getErrorMessage()).toEqual(lang.HTTP_ERRORS.WRONG_PASSWORD);
    //expect(page.getErrorMessage()).toContain('Username or Password is incorrect.');
  });


  it('when user trying to login with valid credentials he should navigate to “Dashboard” page', () => {
    page.fillCredentials(data.validCredentias);
  });

});
