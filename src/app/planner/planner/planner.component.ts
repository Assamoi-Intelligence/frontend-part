import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/models/order';
import { Vehicle } from 'src/app/models/vehicle';
import { OrderService } from 'src/app/order/order.service';
import { VehicleService } from 'src/app/vehicle/vehicle.service';
import { PlannerService } from '../planner.service';
declare var google: any;

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss'],
  providers: [MessageService]
})
export class PlannerComponent implements OnInit {

  options: any;
  overlays: any[] = [];
  vehicles: Vehicle[] = [];
  orders: Order[] = [];
  selectedVehicles: Vehicle[] = [];

  allQuantities: number = 0;
  allCapacities: number = 0;

  constructor(
    private orderService: OrderService,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private plannerService: PlannerService
  ) { }

  ngOnInit(): void {
    this.initMap();
    this.loadVehicles();
    this.loadOrders();
  }

  loadVehicles() {
    this.vehicleService.getVehiclesRas().subscribe(data => {
      this.vehicles = data;
    }, (err) => {
      console.log('Error', err);
      this.messageService.add({severity:'error', summary: 'Error vehicles', detail: `${err}`, life: 10000});
    });
  }

  loadOrders() {
    this.orderService.getAllOrder().subscribe(data => {
      this.orders = data;
      this.loadOrderForMap(this.orders);
    }, (err) => {
      console.log('Error', err);
      this.messageService.add({severity:'error', summary: 'Error orders', detail: `${err}`, life: 10000});
    });
  }

  loadOrderForMap(orders: Order[]) {
      for (let index = 0; index < orders.length; index++) {
        const element = orders[index];
        this.overlays.push(new google.maps.Marker({position: {
          lat: element.locationlatitude,
          lng: element.locationlongitude,
          title: `Client: ${element}, Demand: ${element.productquantity}`}
        }));
      }
      this.allQuantities = this.orders.map(e =>e.productquantity).reduce((a, b) => a+b, 0);
  }

  initMap() {
    this.options = {
      center: {lat: 5.391369856212231, lng: -4.019645815219227},
      zoom: 15
    };
  }

  computeCapacityAndQuantity() {
    this.allCapacities = this.selectedVehicles.map(e => e.capacity).reduce((a,b) => a + b, 0);
  }

  startRouting() {
    const data = {
      vehicles: this.selectedVehicles.map(e => e.id),
      orders: this.orders.map(e => e.id)
    }
    this.plannerService.startRoutingAPI(data).subscribe(response => {
      console.log(response);
    }, err => {
      this.messageService.add({severity:'error', summary: 'Error start routing', detail: `${err}`, life: 15000});
    });
  }

}
