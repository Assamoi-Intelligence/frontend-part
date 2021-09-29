import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/models/order';
import { Vehicle } from 'src/app/models/vehicle';
import { PlannerService } from '../planner.service';
declare var google: any;
import { KMEANS } from 'density-clustering';

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

  ordersToVehicle: Number[][] = [];

  depot = {
    lat: 5.36964,
    lng:  -3.97025
  };

  constructor(
    private messageService: MessageService,
    private plannerService: PlannerService
  ) { }

  ngOnInit(): void {
    this.initMap();
    this.loadVehicles();
    this.loadOrders();
    this.plannerService.getDispatchRouteToVehicle().subscribe(data => {
      this.ordersToVehicle = data;
    })
  }

  loadVehicles() {
    this.plannerService.getVehiclesRas().subscribe(data => {
      this.vehicles = data;
    }, (err) => {
      console.log('Error', err);
      this.messageService.add({severity:'error', summary: 'Error vehicles', detail: `${err}`, life: 10000});
    });
  }

  loadOrders() {
    this.plannerService.getAllOrder().subscribe(data => {
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
          },
          title: `Client: ${element.clientnumber}, Demand: ${element.productquantity}`,
          label: {text: `${element.id}`, color: 'white'},
          animation: google.maps.Animation.DROP,
          optimized: true,
          opacity: 0.9
        }));
      }
      this.allQuantities = this.orders.map(e =>e.productquantity).reduce((a, b) => a+b, 0);
  }


  clustering() {
    this.ordersToVehicle = [];
    for (let i = 0; i < this.vehicles.length + 1; i++) {
      this.ordersToVehicle.push([])
    }
    if(this.orders.length > 0) {
      const points = this.orders.map(el => [el.locationlatitude, el.locationlongitude]);
      const kmeans = new KMEANS();
      let clusters = kmeans.run(points, 4);
      let orders = clusters;
      let k = 1;
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].length; j++) {
          orders[i][j] = orders[i][j] + 1;
          if(this.ordersToVehicle[k].length < (this.orders.length / this.vehicles.length)) {
            this.ordersToVehicle[k].push(orders[i][j]);
          } else {
            k = k + 1;
            this.ordersToVehicle[k].push(orders[i][j]);
          }
        }
      }

      this.plannerService.dispatchRouteToVehicle(this.ordersToVehicle).subscribe(data => {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Dispatch Routing Success', life: 3000});
      }, (err) => {
        this.messageService.add({severity:'error', summary: 'Error orders', detail: `${err}`, life: 10000});
        this.ordersToVehicle = [];
      });
    }
  }

  initMap() {
    this.options = {
      center: this.depot,
      zoom: 13
    };

    this.overlays.push(new google.maps.Marker({position: {
      lat: this.depot.lat,
      lng: this.depot.lng,
      },
      animation: google.maps.Animation.BOUNCE,
      optimized: true,
    }));

    this.overlays.push(google.maps.DirectionServive().route({
      origin : new google.maps.LatLng(this.depot.lng, this.depot.lng),
      destination: new google.maps.LatLng(5.34006, -3.92053),
      travelMode: google.maps.TravelMode.DRIVING
    }));

  }

  computeCapacityAndQuantity() {
    this.allCapacities = this.selectedVehicles.map(e => e.capacity).reduce((a,b) => a + b, 0);
  }

  startRouting() {
    const data = {
      vehicles: this.selectedVehicles.map(e => e.id),
      routes: this.ordersToVehicle
    }
    this.plannerService.startRoutingAPI(data).subscribe(response => {
      console.log(response);
    }, err => {
      this.messageService.add({severity:'error', summary: 'Error start routing', detail: `${err}`, life: 15000});
    });
  }

  addOrdersToVehicle(event: any, vehicleId: number) {
      if(event.value == parseInt(event.value)) {
        if( !((1 <= parseInt(event.value)) && (parseInt(event.value)<= this.orders.length)) ) {
          this.ordersToVehicle[vehicleId].pop();
          return;
        }
        this.plannerService.dispatchRouteToVehicle(this.ordersToVehicle).subscribe(data => {
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Dispatch Routing Success', life: 3000});
        })
      } else {
        this.ordersToVehicle[vehicleId].pop();
      }
  }

  removeOrdersToVehicle(event: any, vehicleId: number) {
    this.plannerService.dispatchRouteToVehicle(this.ordersToVehicle).subscribe(data => {
      this.messageService.add({severity:'success', summary: 'Successful', detail: 'Dispatch Routing Success', life: 3000});
    }, (err) => {
      this.messageService.add({severity:'error', summary: 'Error orders', detail: `${err}`, life: 10000});
    })
  }

}
