import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Users } from 'src/app/model/users';
import { DataState } from 'src/app/model/utils/data-state';
import { NotificationService } from 'src/app/service/notification.service';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList: Users[] = [];
  storeID: any;
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  errorMessage: string = ''; 

  constructor(private location: Location,
    private aurhtService: AuthService,
       private userService: UsersService,
    private router: Router,
    private notifier: NotificationService
  ) { }


  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(): void {
    this.appState = DataState.LOADING_STATE;
    this.userService.users$(0, 100).subscribe({
      next: (response => {
        this.userList = response.data.page.content;
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        if (error) {
          this.appState = DataState.ERROR_STATE;
          this.notifier.onError(error.error);
          this.errorMessage = error.error;
        }
      },
      complete: () => {
        this.appState = DataState.LOADED_STATE;
      }
    });
  }


  public searchUser(key: string): void {
    let result: Users[] = [];
    for (const user of this.userList) {
      if (
        user.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        result.push(user);
      
      }
  
    }
    this.userList = result;
    // if not search match
    if (result.length === 0) {
      this.getUsers()
    }
  }
}
