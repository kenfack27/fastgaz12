import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../service/storeService.service';
import { UsersService } from '../service/users.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {




  private breakpointObserver = inject(BreakpointObserver);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storeService = inject(StoreService);
  private userService = inject(UsersService);
  private notifier = inject(NotificationService);
  storeID: string = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.storeID = this.route.snapshot.paramMap.get("id");

  }

  onGoToProduct() {
    this.router.navigate(["/admin/products"]);
  }

  onGoToManagement() {

    this.userService.hasRoleSYADMIN$().subscribe(
      {
        next: (response=>{
          if(response.data.hasRoleSYSADMIN){
            this.router.navigate(["/management"]);
          }else{
            this.notifier.onWarning("You don't have privillege");
          }
        }),
        error: (error)=>{
          console.error(error)
          if(error){
            this.notifier.onError(error.error);
          }
          // this.notifier.onError("An erro occured. Please Login");
          this.notifier.onError(error);
        }
      }
    )
    
  }

  onLogout() {

  }
}
