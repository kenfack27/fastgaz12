import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StoreOwner } from 'src/app/model/storeOwner';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-list-store',
  templateUrl: './list-store.component.html',
  styleUrls: ['./list-store.component.css']
})
export class ListStoreComponent  implements OnInit{
  myStoreList:StoreOwner[]=[];


  constructor(private location: Location,private storeService:StoreService ) { }


  ngOnInit(): void {
    this.getMyStores();
  }


  getMyStores():void{
    this.storeService.ListOfMyStores$().subscribe({
      next: (response)=>{
        this.myStoreList = response.data.storeOwners;
      },
      error: (error)=>{},
      complete: ()=>{}
    })
  }
  onGoBack() {
    this.location.back();
  }

}
