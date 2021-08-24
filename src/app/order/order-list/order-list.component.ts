import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Order } from 'src/app/models/order';
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
    }, (err) => {
      console.log(err);
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
        console.log('Delete successfull')
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
          }, err => {
            this.messageService.add({severity:'error', summary: 'Error', detail: `Error occured when deleted`, life: 7000});
            this.getAllOrders();
          })
      }
  });
  }



}