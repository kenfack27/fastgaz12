import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Users } from 'src/app/model/users';
import { DataState } from 'src/app/model/utils/data-state';
import { MessageModalService } from 'src/app/service/message-modal.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {

  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  storeID: number;
  storeUUID: string;
  userFound: Users = {
    id: 0,
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    imageUrl: '',
    fullName: '',
    username: ''
  };
  userId: number;
  private isUpdate: boolean = false;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();


  constructor(private location: Location,
    private aurhtService: AuthService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private notifier: NotificationService,
    private router: Router,
    private alertService: MessageModalService
  ) { }

  ngOnInit(): void {
    this.storeUUID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeUUID);
    this.userId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getUser(this.userId);

  }

  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeUUID).subscribe({
      next: (response) => {
        this.storeID = response.data.store.id;
      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        this.router.navigate(["/login"]);
        console.error(error);
      }
    });
  }


  onRemoveManagerToMyStore(arg0: Users) {

  }

  onAddManagerToMyStore(user: Users) {
    const confirmed: boolean = false;
    this.alertService.confirmMessage("By click on yes you accept, this user as manager of your store");
    this.alertService.checkDiscaseValueAfterCloseModale$().subscribe(
      {
        next: response => {
          if (response) {
            this.alertService.updateValue();
            this.addUserToMyStore(user.email, this.storeID);
          } else {
            
          }
        }
      }
    )
  }

  addUserToMyStore(email: string, storeID: number) {
    this.loading.next(true);
    this.storeService.addUserToStore$(email,storeID).subscribe(
      {
        next: (response) => {
          this.notifier.onSuccess(response.message);
          this.isUpdate = true;
          this.loading.next(false);
        },
        error: (error) => {
          console.error(error)
          this.loading.next(false);
          if (error) {
            this.notifier.onWarning(error.error.error);
          } 
        }
      });
  }

  private getUser(userId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.userService.user$(userId).subscribe({
      next: (response => {
        this.userFound = response.data.user;
        // this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        if (error) {
          this.appState = DataState.ERROR_STATE;
          this.notifier.onError(error.error);
        }
      },
      complete: () => {
        this.appState = DataState.LOADED_STATE;
      }
    });
  }


  onGoBack() {
    if (!this.isUpdate) {
      this.alertService.confirmMessage("Do you want to discase the change ?");
      this.alertService.checkDiscaseValueAfterCloseModale$().subscribe(
        {
          next: response => {
            if (response) {
              this.alertService.updateValue();
              this.location.back();
            } else {
            }
          }
        }
      )
    } else {
      this.location.back();
    }
  }

}
