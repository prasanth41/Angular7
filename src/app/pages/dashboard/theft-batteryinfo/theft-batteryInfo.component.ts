import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DashboardComponent } from '../dashboard.component';
import { DashboardService } from '../dashboard.service';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core';

@Component({
     selector: 'am-theftBatteryInfo',
     encapsulation: ViewEncapsulation.None,
     templateUrl: './theft-batteryInfo.component.html',
     providers: [DashboardService, GoogleMapsAPIWrapper],

})
export class TheftInfoComponent implements OnInit {
     public data: any = {};
     private lat: number;
     private lng: number;
     private originLat: number;
     private originLng: number;
     private zoom: number = 12;
     public origin: string;
     public destination = { lat: 24.799524, lng: 120.975017 };
     constructor(private mapsAPILoader: MapsAPILoader, googleMapsAPIWrapper: GoogleMapsAPIWrapper) {
          this.data = JSON.parse(sessionStorage.getItem('theftBatteryInfoMarker'));
          console.log(this.data);
          this.origin = this.data.originAddress;
          this.destination = this.data.destinationLatLng;
          // this.mapsAPILoader.load().then(() => {
          //   var geocoder = new google.maps.Geocoder();
          //   geocoder.geocode({ 'address': this.data.originAddress }, (results, status) => {
          //     if (status === google.maps.GeocoderStatus.OK) {
          //       this.originLat = results[0].geometry.location.lat();
          //       this.originLng = results[0].geometry.location.lng();
          //       this.origin = { 'lat': this.originLat, 'lng': this.originLng };
          //       this.destination = this.data.destinationLatLng;
          //     }
          //   });
          // });
     }
     ngOnInit() {
     }
     public renderOptions = {
          suppressMarkers: true,
     }

     public markerOptions = {
          origin: {
               icon: 'assets/img/source.png',
               draggable: true,
          },
          destination: {
               icon: 'assets/img/destination.png',
               opacity: 0.8,
          },
     }
}
