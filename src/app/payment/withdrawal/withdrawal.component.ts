import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TransactionHistoryService } from 'src/app/service/transaction-history.service';
import { TransactionHistoryRequest } from '../../model/request/transaction-history-request';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent {
  withdrawalForm = this.fb.group({
    amount: [0, Validators.required]
  });
  message: string = '';
  messageError: string = null;

  loadingSuject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  isLoading = this.loadingSuject$.asObservable();

  constructor(private fb: FormBuilder, private transactionHistoryService: TransactionHistoryService,
    private location:Location
  ) { }

  onWithdraw() {
    let request: TransactionHistoryRequest = {
      amount: this.withdrawalForm.value.amount
    };
    this.save(request);
  }

  save(request: TransactionHistoryRequest): void {
    this.loadingSuject$.next(true);
    this.transactionHistoryService.saveTransaction(request).subscribe({
      next: (response => {
        this.loadingSuject$.next(false);
        this.message = response.message;
        this.messageError = null;
      }),
      error: (error => {
        // console.error(error);
        this.messageError = error.error.error;

        if(error.error.validationError){
          this.messageError = error.error.validationError;
          console.log(error.error.validationError)
        }
        this.loadingSuject$.next(false);
        this.message = "";
      }),
      complete: (() => {
        this.loadingSuject$.next(false);
      })
    })
  }
  onGoBack() {
   this.location.back();
  }

}
