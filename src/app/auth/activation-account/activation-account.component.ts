import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-activation-account',
  templateUrl: './activation-account.component.html',
  styleUrls: ['./activation-account.component.css']
})
export class ActivationAccountComponent {


  summitted: boolean = false;
  isOkay: boolean = true;
  errMessage: string = null;
  constructor(private router: Router, private auth: AuthService, private notifier: NotificationService) { }



  onCodeChanged($event: string) {

  }

  onCodeCompleted($event: string) {
    this.confirmationAccount($event);
  }



  private confirmationAccount(token: string): void {
    this.auth.confirm$(token).subscribe(
      {
        next: (response) => {
          this.summitted = true;
          this.notifier.onSuccess(response.message);
          this.isOkay=true;
        },
        error: (error) => {
          this.errMessage = 'Token has been expired or invalid';
          this.notifier.onError("Token has been expired or invalid");
          this.summitted = true;
          this.isOkay = false;
        }
      }
    )

  }


  onGoToLogin() {
    this.router.navigate(['/login'])
  }

}
