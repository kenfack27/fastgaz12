import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/model/users';
import { NotificationService } from 'src/app/service/notification.service';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  currentEmail: string = '';
  me: Users = {
    id: 0,
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    imageUrl: '',
    fullName: '',
    username: ''
  };

  constructor(
    private userService: UsersService,
    private notifier: NotificationService
  ) { }

  ngOnInit(): void {
    console.log("new value %s", this.currentEmail);
    this.myProdile();
  }


  private myProdile(): void {
    this.userService.me$().subscribe(
      {
        next: (response => {
          this.me = response.data.user
        }),
        error: (error => {
          console.error(error.error.error);
          this.notifier.onError("An error occure. Please reload");
          this.notifier.onError(error.error.error);
        })
      }
    )
  }

  onSendEmailToChangePassword() {
    console.log(this.currentEmail);
  }

}
