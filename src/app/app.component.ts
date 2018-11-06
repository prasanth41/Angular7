import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'az-root',
  encapsulation: ViewEncapsulation.None,
  template: `<ng-http-loader backgroundColor="#006eb3" spinner="sk-rotationg-plane"></ng-http-loader><router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss']
})

export class AppComponent { }
