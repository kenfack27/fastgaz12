import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PasswordService } from '../../service/password.service';
import { NotificationService } from 'src/app/service/notification.service';
import { RequestPassword } from 'src/app/model/request/password-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  request: RequestPassword = {
    email: '',
    newPassword: ''
  }

  updateForm = this.fbuilder.group({
    email: ['', [Validators.email, Validators.required]],
    newPassword: ['', [Validators.minLength(8), Validators.required]],
  });

  constructor(private fbuilder: FormBuilder, private passwordService: PasswordService,
    private notifier: NotificationService,private router:Router) { }




  onSaveNewPassword() {
    this.request.email = this.updateForm.value.email;
    this.request.newPassword = this.updateForm.value.newPassword;
    this.saveNewPassword(this.request);
  }

  private saveNewPassword(passworsRequest: any): void {
    this.loading.next(true);
    this.passwordService.updatePassword$(passworsRequest).subscribe(
      {
        next: (response) => {
          this.notifier.onSuccess(response.message);
          this.loading.next(false);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading.next(false);
          this.notifier.onError(error.message);
        }
      }
    );
  }

}
