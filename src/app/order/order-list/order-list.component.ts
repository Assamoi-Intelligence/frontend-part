import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Order } from 'src/app/models/order';
import { urlUploadOrder } from 'src/app/url';
import { AddEditOrderComponent } from '../add-edit-order/add-edit-order.component';
import { OrderService } from '../order.service';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class OrderListComponent implements OnInit {

  ref!: DynamicDialogRef | undefined;
  orders: Order[] = [];
  selectedOrders: Order[] = [];

  // GENERATOR ORDERS VARIABLES
  displayGeneratorOrderDialog = false;
  numberOfOrdersGen!: number;
  timeMinGen!: Date;
  timeMaxGen!: Date;
  isLoading = true;


  urlUpload = urlUploadOrder;

  constructor(
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private orderService: OrderService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderService.getAllOrder().subscribe((data: Order[]) => {
      this.orders = data;
      this.isLoading = false;
    }, (err) => {
      console.log(err);
      this.messageService.add({severity:'error', summary: 'Error', detail: `UNABLE TO GET ORDERS ${err}`, life: 11000});
    });
  }

  addOrder() {
    this.ref = this.dialogService.open(AddEditOrderComponent, {
      header: 'Ajouter une commande',
      modal: true,
      width: '60%',
      height: '90%',
      data: {
        isAdd: true
      },
      contentStyle: {"padding-top": "2rem", "overflow": "auto"},
    });
    this.ref.onClose.subscribe(data => {
      if(typeof data === "boolean" && data === true) {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Vehicle added with success', life: 3000});
        this.getAllOrders();
      } else if(typeof data === "string") {
        this.messageService.add({severity:'error', summary: 'Error', detail: `Error occured when added ${data}`, life: 7000});
      }
    });
  }

  editOrder(order: Order) {
    order.timewindowstart = new Date(order.timewindowstart);
    order.timewindowend = new Date(order.timewindowend);
    this.ref = this.dialogService.open(AddEditOrderComponent, {
      header: 'Modifier la commande',
      modal: true,
      width: '60%',
      height: '90%',
      data: {
        isAdd: false,
        order: order,
        id: order.id
      },
      contentStyle: {"padding-top": "2rem", "overflow": "auto"},
    });
    this.ref.onClose.subscribe(data => {
      if(typeof data === "boolean" && data === true) {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Vehicle added with success', life: 3000});
        this.getAllOrders();
      } else if(typeof data === "string") {
        this.messageService.add({severity:'error', summary: 'Error', detail: `Error occured when added ${data}`, life: 7000});
      }
    });
  }

  deleteOrder(order: Order) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the order of ${order.clientnumber}`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.delete(order.id).subscribe(res => {
          console.log(res);
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Order deleted with success', life: 3000});
          this.getAllOrders();
        }, err => {
          this.messageService.add({severity:'error', summary: 'Error', detail: `Error occured when deleted`, life: 7000});
          this.getAllOrders();
        })
      },
    });
  }

  deleteSelectedOrder() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected orders?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          const ids = this.selectedOrders.map(e => e.id);
          this.orderService.deletedOrdersSelected(ids).subscribe(res => {
            console.log(res);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Orders selected deleted with success', life: 3000});
            this.getAllOrders();
            this.selectedOrders = [];
          }, err => {
            this.messageService.add({severity:'error', summary: 'Error', detail: `Error occured when deleted`, life: 7000});
            this.getAllOrders();
          })
      }
    });
  }

  uploadFile(event: any) {
    this.getAllOrders();
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: '', life: 5000});
  }

  uploadFileError(event: any) {
    this.messageService.add({severity:'error', summary: 'Error', detail: `Error file upload`, life: 7000});
  }

  exportDbToExcel() {
    this.orderService.exportOrders().subscribe((data: any) => {
      this.downloadFile(data, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      this.messageService.add({severity:'info', summary: 'Export', detail: 'Exporting...', life: 3000});
    }, (err) => {
      console.log(err);
      this.messageService.add({severity:'error', summary: 'Error', detail: `UNABLE TO EXPORT ${err}`, life: 11000});
    });
  }

  downloadFile(data: Blob, type: any) {
    const file: Blob = new Blob([data], {type: type});
    let url = window.URL.createObjectURL(file);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert( 'Please disable your Pop-up blocker and try again.');
    }
  }


  generateOrders() {
    if(typeof this.numberOfOrdersGen === 'undefined') this.numberOfOrdersGen = 20
    if(typeof this.timeMinGen === 'undefined') this.timeMinGen = new Date(new Date().setHours(10, 0, 0));
    if(typeof this.timeMaxGen === 'undefined') this.timeMaxGen = new Date(new Date().setHours(15, 30, 0));
    console.log(this.numberOfOrdersGen, this.timeMinGen,this.timeMaxGen);
    let orders: Order[] = [];



    for(let i = 0; i < this.numberOfOrdersGen; i++) {

      let order: Order = {id: i+1,clientnumber: '', locationlatitude: 2, locationlongitude: 2, timewindowstart: 23, timewindowend: 23, productquantity: 23}
    }

    this.displayGeneratorOrderDialog = false;
  }

  generatePhoneNumber() {

  }

  generateLatLong() {

  }


}
