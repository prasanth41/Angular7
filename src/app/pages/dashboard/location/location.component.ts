import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AgmMap, MapsAPILoader } from '@agm/core';

@Component({
     selector: 'am-location',
     encapsulation: ViewEncapsulation.None,
     templateUrl: './location.component.html',
     styles: [`
       agm-map {
         height: 300px;
     }
       `]
})
export class LocationComponent implements OnInit {
     @ViewChild('map') public agmMap: AgmMap;
     @ViewChild('autoShownLocation') autoShownLocation: ModalDirective;
     private moved_location_lat: number = 0;
     private moved_location_lon: number = 0;
     private assetLocationName: string = "";
     private image: string = "";
     private mapsAPILoader: MapsAPILoader;


     constructor(mapsAPILoader: MapsAPILoader) {
          this.mapsAPILoader = mapsAPILoader;
     }

     ngOnInit() {
          this.resizeMap();
     }

     //resizeMap
     resizeMap() {
          this.agmMap.triggerResize();
     }
     //showMap
     showMap(data): void {
          this.moved_location_lat = data.moved_location_lat;
          this.moved_location_lon = data.moved_location_lon;
          this.assetLocationName = data.name;
          this.image = data.image;
          this.autoShownLocation.show();
     }

     //hideMap
     hideMap(): void {
          this.autoShownLocation.hide();
     }

     onShown(): void {
          this.agmMap.triggerResize();
     }

}