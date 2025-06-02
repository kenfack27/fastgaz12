import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Commission } from 'src/app/model/commission';
import { NotificationService } from 'src/app/service/notification.service';

import { CommissionService } from '../../service/commission.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-commission-system',
  templateUrl: './commission-system.component.html',
  styleUrls: ['./commission-system.component.css']
})
export class CommissionSystemComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['order', 'orderAmount', 'amount', 'created_at'];
  dataSource = new MatTableDataSource<Commission>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalCommission: number = 0;
  list: Commission[] = [];

  datePickerFrom = this.fb.group({
    releasedAt: []
  });

  createdDate: any = "2024-12-11";

  constructor(private commissionService: CommissionService, 
    private notifier: NotificationService,
    private datePipe: DatePipe, private fb: FormBuilder
  ) { 
    this.createdDate = this.datePipe.transform( new Date(),'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getCommissions();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  getCommissions() {
    this.commissionService.getCommissionByUser$().subscribe(
      (res) => {
        this.dataSource.data = res.data.commissions;
        res.data.commissions.forEach(commision => {
          this.totalCommission += commision.amount;
        });
        this.notifier.onDefault("Commission successfuly loaded");
      },
      (error) => {
        this.notifier.onError('Error');
      }
    );
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.createdDate =
        this.datePipe.transform(event.value, 'yyyy-MM-dd');
      this.getCommissionByDate(this.createdDate);
    }
  }


  getCommissionByDate(createdDate: any) {
    this.commissionService.getCommissionByUserAndcreatedAt$(createdDate).subscribe(
      (res) => {
        this.dataSource.data = res.data.commissions;
        this.notifier.onDefault(res.message);
      },
      (error) => {
        console.log(error.error.message);
        this.notifier.onError(error.error.message);
        this.notifier.onError('Oops ! An error occured while retrived');
      }
    );
  }

}
