import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent {

  constructor(private location: Location, private router: Router) { }
  onGoBack() {
    this.location.back();
  }

  onStore(lat:any,lng:any):void{
    this.router.navigate(["service/store/", lat, lng]);
   
  }
}
