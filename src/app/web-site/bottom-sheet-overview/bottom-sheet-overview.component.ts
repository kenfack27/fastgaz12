import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-sheet-overview',
  templateUrl: './bottom-sheet-overview.component.html',
  styleUrls: ['./bottom-sheet-overview.component.css']
})
export class BottomSheetOverviewComponent {


  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data:google.maps.MapMouseEvent,
    private router: Router
  ) { }

  onStore():void{
    let lat = this.data.latLng.toJSON().lat;  
    let lng = this.data.latLng.toJSON().lng;
    this.router.navigate(["service/store/", lat, lng]);
    this.bottomSheetRef.dismiss();
  }
}
