import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { UsersService } from '../service/users.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-web-site',
  templateUrl: './web-site.component.html',
  styleUrls: ['./web-site.component.css']
})
export class WebSiteComponent implements OnInit {
  owner = new BehaviorSubject(false);
  isOwner$ = this.owner.asObservable();
  delivery = new BehaviorSubject(false);
  isDelivery$ = this.delivery.asObservable();

  private breakpointObserver = inject(BreakpointObserver);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UsersService);
  private notifier = inject(NotificationService);
constructor() {
  if (Capacitor.getPlatform() === 'ios') {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark }); // selon ton thème
  }
}
  ngOnInit(): void {
    var userId = parseInt(this.route.snapshot.paramMap.get("id"));
  }

  findStoreOwner(userId: number): void {
    this.owner.next(true);
  }


  onGoToManagement() {

    this.userService.hasRoleSYADMIN$().subscribe(
      {
        next: (response => {
          if (response.data.hasRoleSYSADMIN) {
            this.router.navigate(["/management"]);
          } else {
            this.notifier.onWarning("You don't have privillege");
          }
        }),
        error: (error) => {
          console.error(error)
          if(error){
            this.notifier.onError(error.error);
            console.error(error)
          }
          this.notifier.onError("An erro occured. Please Login");
        }
      }
    )

  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
