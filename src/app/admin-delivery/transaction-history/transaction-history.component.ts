import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaymentStatus } from 'src/app/model/enum/paymentStatus';
import { TransactionHistory } from 'src/app/model/transaction-history';
import { DataState } from 'src/app/model/utils/data-state';
import { NotificationService } from 'src/app/service/notification.service';
import { TransactionHistoryService } from 'src/app/service/transaction-history.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
 

  transactionHistories: TransactionHistory[] = [];
  appState: DataState = DataState.LOADING_STATE;

  readonly paymentStatus = PaymentStatus;

  readonly DataState = DataState;
  messageError: any = "";
  constructor(private transactionHistoryService: TransactionHistoryService,
    private notifier: NotificationService,private location:Location
  ) { }

  ngOnInit(): void {
    this.getTransactionHistory();
  }


  private getTransactionHistory(): void {
    this.appState = DataState.LOADING_STATE;
    this.transactionHistoryService.transactionHistories$(0, 10).subscribe(
      {
        next: (response) => {
          this.transactionHistories = response.data.page.content;
          this.appState = DataState.LOADED_STATE;
        },
        error: (error) => {
          console.error(error);
          this.messageError = error.error;

          this.notifier.onError(this.messageError);
          this.appState = DataState.ERROR_STATE;
        }
      }
    )
  }


  onGoBack() {
    this.location.back();
  }

}
