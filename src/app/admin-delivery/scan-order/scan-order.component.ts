import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataState } from 'src/app/model/utils/data-state';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { CustomerOrderService } from 'src/app/service/customer-order.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-scan-order',
  templateUrl: './scan-order.component.html',
  styleUrls: ['./scan-order.component.css']
})
export class ScanOrderComponent {

  isClicked = new BehaviorSubject<boolean>(false);
  clicked$ = this.isClicked.asObservable();
  errMessage: string = null;
  successfulyMessage: string = null;
  productName: string | any = "";
  total: number | any;
  phone: string | any;
  deliveryFee: number | any;
  invoiceNumber: string | any;
  storeName: string | any;
  appState: DataState;
  readonly DataState = DataState;
  messageError: any = "";



  constructor(private notifier: NotificationService, private customerOrderSecureService: CustomerOrderSecureService) {

  }
  onStartScarn() {
    this.isClicked.next(true);
  }

  onStopScarn() {
    this.isClicked.next(false);
  }

  private getInvoiceNumber(invoiceNumber: string) {
    return invoiceNumber;
  }

  scan(result: string) {
    // Split the result by new lines
    const lines = result.split('\n');
    const data: { [key: string]: string | number } = {};

    // Process each line to extract key-value pairs
    lines.forEach(line => {
      const [key, value] = line.split(': ');
      if (key && value) {
        data[key.trim()] = isNaN(Number(value)) ? value.trim() : Number(value);
      }
    });

    // Now you can access the data
    console.log('Extracted Data:', data);

    // Example of accessing specific data
    this.productName = data['Product name'];
    this.total = data['Total'];
    this.phone = data['Phone'];
    this.deliveryFee = data['Delivery Fee'];
    this.invoiceNumber = data['Invoice Number'];
    this.storeName = data['Store'];
    // this.getInvoiceNumber()

    // Displaying the extracted data
    // this.displayData(productName, total, phone, deliveryFee, invoiceNumber, storeName);
  }

  onScanSuccess1(result: string) {
    console.log(result);

    if (result) {
      try {
        // Parse the JSON string
        const data = JSON.parse(result);

        // Accessing the values
        const name = data.name;
        const total = data.total;
        const phone = data.phone;
        const deliveryFee = data.deliveryFee;
        const invoiceNumber = data.invoiceNumber;
        const store = data.store;

        // Log the extracted values

        // Your existing logic
        this.isClicked.next(false);
        this.notifier.onSuccess("Customer order successfully scanned");
        this.successfulyMessage = "Customer order successfully scanned";
      } catch (error) {
        console.error('Error parsing JSON:', error);
        this.errMessage = "Unable to scan!";
        this.notifier.onError("Scan failed. Try again.");
      }
    } else {
      this.errMessage = "Unable to scan!";
      this.notifier.onError("Scan failed. Try again.");
    }
  }



  onScanSuccess(result: string) {
    if (result != null) {
      this.scan(result);

      this.isClicked.next(false);
      this.notifier.onDefault("successfuly scanned");
      this.notifier.onInfo("Please wait a moment");
      this.successfulyMessage = "Customer order successfuly scanned";
      this.validCustomerOrder(this.invoiceNumber);
    } else {
      this.errMessage = "Cannot able to scan !"
      this.notifier.onError("Scan failed. Try again");
    }
  }


  displayData(productName: string | any, total: number | any, phone: string | any, deliveryFee: number | any, invoiceNumber: string | any, storeName: string | any) {
    console.log(`Product Name: ${productName}`);
    console.log(`Total: ${total}`);
    console.log(`Phone: ${phone}`);
    console.log(`Delivery Fee: ${deliveryFee}`);
    console.log(`Invoice Number: ${invoiceNumber}`);
    console.log(`Store: ${storeName}`);
  }

  validCustomerOrder(invoiceNumber: string): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderSecureService.scan$(invoiceNumber).subscribe({
      next: (response => {
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        this.appState = DataState.ERROR_STATE;
        console.error(error);

        this.notifier.onError("Oups! something whent wrong !");
        if (error) {
          this.notifier.onError(error.error.error);
          console.log(error.error.error);
         this.messageError = error.error.error;
        }
      }
    });
  }


}
