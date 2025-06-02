import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminStats } from 'src/app/model/Admin-stats';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { Store } from 'src/app/model/store';
import { StoreOrderStats } from 'src/app/model/store-order-stats';
import { DataState } from 'src/app/model/utils/data-state';
import { AdminService } from 'src/app/service/admin.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {


  totalLivreurs = 0;
  totalBoutiques = 0;
  commandes = {
    enAttente: 0,
    enCours: 0,
    livrees: 0
  };

  stats: AdminStats = {
    totalLivreurs: 0,
    totalBoutiques: 0,
    commandesPending: 0,
    commandesApproved: 0,
    commandesPaid: 0,
    commandesInDelivery: 0
  };

  myStoreList: Store[] = [];
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;

  statsALL: StoreOrderStats[] = [];

  selectedDate: Date = new Date();

  displayedColumns = ['store', 'pending', 'approved', 'paid', 'delivery'];

  dataSource = new MatTableDataSource<StoreOrderStats>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  APPROVED: OrderStatus = OrderStatus.APPROVED;
  PENDING: OrderStatus = OrderStatus.PENDING;
  PAID: OrderStatus = OrderStatus.PAID;
  INDELIVERY: OrderStatus = OrderStatus.INDELIVERY;


  constructor(private location: Location,
    private storeService: StoreService,
    private notifier: NotificationService,
    private adminService: AdminService,
    private router:Router
  ) { }


  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

    this.adminService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error(err)
    });

    this.onLoadStats();
  }


  onLoadStats() {
    const formattedDate = this.selectedDate.toISOString().split('T')[0];
    this.adminService.getStatsAll(formattedDate).subscribe(data => {
      this.statsALL = data;
      this.dataSource.data = data;
    });
  }




  onFilterByOrderStatus(orderstatus: OrderStatus) {
    this.router.navigate(['/management/order-status',orderstatus]);
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
