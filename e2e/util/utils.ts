import { browser, by, element, ExpectedConditions, protractor } from 'protractor';

let validationMessage: string;

export const setName = (locator: any, name: string): void => {
  locator.clear();
  locator.sendKeys(name);
}

export const pressEnter = (locator: any): void => {
  browser.actions().sendKeys(protractor.Key.ENTER).perform();
}

export const click = (locator: any): void => {
  locator.click();
}

export const getTitle = (): any => {
  return browser.getTitle();
}

export const getText = (locator: any): any => {
  return locator.getText();
}

export const unChecked = (locator: any): void => {
  if (locator.isSelected())
    locator.click();
}

export const isChecked = (locator: any): void => {
  if (!locator.isSelected())
    locator.click();
}


export const select = (locator: any, value: any): void => {
  locator.$('[value= "' + value + '"]').click();
}

export const waits12 = (sleep: any, locator: any): void => {
  browser.sleep(2 * (sleep));
  browser.waitForAngular();
}

export const wait = (sleep: any): void => {
  browser.sleep((sleep) * 1000);
}

export const validation = (Id: any, Message: any): void => {
  this.validationMessage = this.getText(element(by.xpath((Id))));
  expect(this.validationMessage).toBe(Message);
}
