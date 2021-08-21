import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Order } from 'src/app/models/order';
import { AddEditOrderComponent } from '../add-edit-order/add-edit-order.component';

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

  constructor(private dialogService: DialogService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.orders = [
      {id: '1', clientnumber: '+224', timewindowstart: Date.now() , timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '2', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '3', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '4', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '5', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '6', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '7', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '8', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '9', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '10', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 123},
      {id: '11', clientnumber: '+22540919200', timewindowstart: Date.now(), timewindowend: Date.now(), locationlatitude: 12, locationlongitude: 23, productquantity: 12},
    ]
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
      console.log('Close');
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
        order: order
      },
      contentStyle: {"padding-top": "2rem", "overflow": "auto"},
    });
    this.ref.onClose.subscribe(data => {
      console.log('Close');
    });
  }

  deleteOrder(order: Order) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the order of ${order.clientnumber}`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Delete successfull')
      },
    });
  }

  deleteSelectedOrder() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected orders?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          console.log('Orders selected deleted')
      }
  });
  }



}
