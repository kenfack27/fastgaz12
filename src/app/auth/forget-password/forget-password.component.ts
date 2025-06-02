import { Component, OnInit } from '@angular/core';
import { PasswordService } from '../../service/password.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit{
  currentEmail: any;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();


  constructor(private passwordService: PasswordService,
    private notifier: NotificationService,
    private location: Location,
    private loadingService: LoadingService) { }

    ngOnInit(): void {
        this.loadingService.loadingOff();
    }
  onGoBack() {
    this.location.back();
  }

  onSendEmailToChangePassword() {
    this.loading.next(true);
    
    console.log(this.currentEmail);
    this.passwordService.forgotPassword$(this.currentEmail).subscribe(
      {
        next: (response) => {
          this.loading.next(false);
          this.notifier.onSuccess("Email sent successfully. Please check your inbox.");
          
        },
        error: (error) => {
          this.loading.next(false);
          console.error(error);
          this.notifier.onError("An error occurred. Please try again later.");
        }
      }
    )
  }


}
