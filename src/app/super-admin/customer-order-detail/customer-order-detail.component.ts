import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrder } from 'src/app/model/customerOrder';
import { CustomerOrderItem } from 'src/app/model/customerOrderItem';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { Store } from 'src/app/model/store';
import { DataState } from 'src/app/model/utils/data-state';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-customer-order-detail',
  templateUrl: './customer-order-detail.component.html',
  styleUrls: ['./customer-order-detail.component.css']
})
export class CustomerOrderDetailComponent implements OnInit , AfterViewInit{

  customerOrderList: CustomerOrder[] = [];
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  readonly status = OrderStatus;


  displayedColumns: string[] = ['id','store','product', 'quantity', 'price','createDate','status'];
  // displayedColumns: string[] = ['id']; 

  dataSource = new  MatTableDataSource<CustomerOrderItem>([]);
  // dataSource = new  MatTableDataSource<CustomerOrder>([]);


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  orderStatus: string | null = null;

  constructor(private location: Location,
    private router: Router,
    private storeService: StoreService,
    private notifier: NotificationService,
    private customerOrderSecureService: CustomerOrderSecureService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(param=>{
      this.orderStatus = param.get("orderStatus");

      this.getCustomerOrderByStatus(this.orderStatus);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  private getCustomerOrderByStatus(orderstatus: OrderStatus| string): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderSecureService.customerOrderItemByOrderStatus$(orderstatus).subscribe({
      next: (response => {

        console.log(response.data.customerOrderItems)
        this.dataSource.data = response.data.customerOrderItems;
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;

        console.log(this.dataSource.data);
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");

        if (error) {
          this.appState = DataState.ERROR_STATE;
        }
      },
      complete: () => {
        this.appState = DataState.LOADED_STATE;
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
