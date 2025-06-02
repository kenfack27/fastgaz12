import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { TokenService } from 'src/app/auth/token.service';
import { Product } from 'src/app/model/product';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProductService } from 'src/app/service/product.service';
import { PurchaseService } from 'src/app/service/purchase.service';
import { SaleService } from 'src/app/service/sale.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  numberSalling: number = 0;
  saleAmount: number = 0;
  customerOrderAmount: number = 0;
  totalsale: number = 0;
  storeID: any;
  purchaseAmount: any = 0.0;
  numberPurchase: string | number = 0;
  productList: Product[] = [];

  constructor(private location: Location,
    private tokenService: TokenService,
    private saleservice: SaleService,
    private storeService: StoreService,
    private notifier: NotificationService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private customerOrderService:CustomerOrderSecureService
  ) { }

  ngOnInit(): void {
    // sellerPerMonth();
    // mostSellerProduct();
    this.username = this.tokenService.getUserUsername();

    this.storeID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeID);
      }

  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        // this.getNumberSale(response.data.store.id);
        this.getSaleAmount(response.data.store.id);

        // this.getNumberPurchase(response.data.store.id);
        this.getPurchaseAmount(response.data.store.id);

        this.getTotalCustomerOrderAmount(response.data.store.id)

        // state stock
        this.getProductByStore(response.data.store.id);

      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        console.error(error);
      }
    })
  }

  private getNumberSale(storeId: number): void {
    this.saleservice.getNumberSale(storeId).subscribe({
      next: (response) => {
        this.numberSalling = response.data.totalSale;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getSaleAmount(storeId: number): void {
    this.saleservice.getSaleAmount(storeId).subscribe({
      next: (response) => {
        this.saleAmount = response.data.amountSale;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  // total amount of customer order 
  // todo: We will fetch this based on date passed 28D
  getTotalCustomerOrderAmount(storeId: number): void {
    this.customerOrderService.getCustomerOrderAmount(storeId).subscribe({
      next: (response) => {
        
        this.customerOrderAmount = response.data.amountCustomerOrder;
        this.totalsale = this.saleAmount + this.customerOrderAmount;
       
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  private getNumberPurchase(storeId: number): void {
    this.purchaseService.getNumberPurchase(storeId).subscribe({
      next: (response) => {
        this.numberPurchase = response.data.totalPurchase;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getPurchaseAmount(storeId: number): void {
    this.purchaseService.getPuchaseAmount(storeId).subscribe({
      next: (response) => {
        this.purchaseAmount = response.data.amountPurchase;
      },
      error: (error) => {
        console.error(error);
      }});
  }

  // State stock
  private getProductByStore(storeId: number): void {
    this.productService.products$(storeId).subscribe({
      next: (response) => {
        this.productList = response.data.products;
        productStateStock(response.data.products);
      },
      error: (error) => {
        console.error(error);
      }});
  }

  onGoBack() {
    this.location.back();
  }

}

async function sellerPerMonth() {
  const data = [
    { month: 'Aug', amount: 280000 },
    { month: 'Sep', amount: 100000 },
    { month: 'Oct', amount: 150000 },
    { month: 'Nov', amount: 280000 },
    { month: 'Desc', amount: 400000 },
  ];
  const canvas: any = document.getElementById('acquisitions');
  var option = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart - Cubic interpolation mode'
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
        },
        suggestedMin: -100000,
        suggestedMax: 700000
      }
    }

  }
  new Chart(
    canvas,
    {
      type: 'line',
      options: {},
      data: {
        labels: data.map(row => row.month),
        datasets: [
          {
            label: 'Acquisitions by month',
            data: data.map(row => row.amount),
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
          }
        ]
      }
    }
  );
}


async function mostSellerProduct() {
  const canvas: any = document.getElementById("mostSeller");
  const data = {
    labels: [
      'Total',
      'Tradex',
    ],
    datasets: [{
      label: 'Most Seller Gaz',
      data: [300, 500],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
      ],
      hoverOffset: 4
    }]
  };

  new Chart(
    canvas,
    {
      type: 'doughnut',
      data: data,
    }
  );
}

async function productStateStock(productList:Product[]) {
  const canvas: any = document.getElementById("mostSeller");
  const label:string[]=[];
  const dataStock:number[]=[];
  for (const product of productList) {
    label.push(product.name);
    dataStock.push(product.quantity);
  }
  const data = {
    labels: label,
    datasets: [{
      label: 'Most Seller Product',
      data: dataStock,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(54, 152, 21)',
        'rgb(235, 66, 54)',
        'rgb(25, 97, 145)',
        'rgb(236, 215, 22)',
        'rgb(25, 47, 145)',
      ],
      hoverOffset: 4
    }]
  };

  new Chart(
    canvas,
    {
      type: 'doughnut',
      data: data,
    }
  );
}