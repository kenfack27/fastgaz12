import { AfterViewInit, Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/auth/token.service';
import { DataState } from 'src/app/model/utils/data-state';
import { Store } from 'src/app/model/store';
import { StoreOwner } from 'src/app/model/storeOwner';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-coonect-stores',
  templateUrl: './coonect-stores.component.html',
  styleUrls: ['./coonect-stores.component.css']
})
export class CoonectStoresComponent implements OnInit {
  FAKE_USER_ID: string = "";
  myStoreList:StoreOwner[]=[];
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;

  constructor(private tokenSerice: TokenService,private _bottomSheetRef: MatBottomSheetRef<CoonectStoresComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data:Store,
  private storeService:StoreService,private router:Router,private notifier:NotificationService) { }

  ngOnInit(): void {
    this.FAKE_USER_ID = this.tokenSerice.gettUserFakeID();
    this.getMyStores();
  }
  

  openLink(owner: StoreOwner) {
    console.log(owner);
    if(owner.accessRevoked){
      this.notifier.onError("You cannot. You access has been revoked")
    }else{
    this.router.navigate(["/admin"]);
    this._bottomSheetRef.dismiss();
    this.notifier.onDefault("Stwitch to " + owner.store.name);
    this.storeService.setStoreID(owner.store.uuiId);
    // this._bottomSheetRef.afterDismissed();
    }
  }

  getMyStores():void{
    this.appState = DataState.LOADING_STATE;
    this.storeService.ListOfMyStores$().subscribe({
      next: (response)=>{
        this.appState = DataState.LOADED_STATE;
        this.myStoreList = response.data.storeOwners;
      },
      error: (error)=>{
        console.error(error);
        this.appState = DataState.ERROR_STATE;
        localStorage.clear();
      },
      complete: ()=>{}
    })
  }

}


