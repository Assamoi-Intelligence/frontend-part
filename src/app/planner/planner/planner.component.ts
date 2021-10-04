import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/models/order';
import { Vehicle } from 'src/app/models/vehicle';
import { PlannerService } from '../planner.service';
declare var google: any;
import { KMEANS } from 'density-clustering';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlannerDetailComponent } from '../planner-detail/planner-detail.component';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss'],
  providers: [MessageService, DialogService]
})
export class PlannerComponent implements OnInit {
  options: any;
  overlays: any[] = [];
  vehicles: Vehicle[] = [];
  orders: Order[] = [];
  selectedVehicles: Vehicle[] = [];

  allQuantities: number = 0;
  allCapacities: number = 0;

  ordersToVehicle: number[][] = [];
  optimizedRoutes: number[][] = [];
  isOptimized: boolean = false;
  ref!: DynamicDialogRef | undefined;

  map!: any;
  depot = {
    lat: 5.36964,
    lng:  -3.97025
  };

  constructor(
    private dialogService: DialogService,
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
      this.allCapacities = this.vehicles.map(e => e.capacity).reduce((a,b) => a + b, 0);
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
  }

  getMap(map: any) {
    this.map = map;
  }

  computeCapacityAndQuantity() {
    this.allCapacities = this.selectedVehicles.map(e => e.capacity).reduce((a,b) => a + b, 0);
  }

  startRouting() {
    const data = {
      vehicles: this./*selectedVehicles*/vehicles.map(e => e.id),
      routes: this.ordersToVehicle
    }
    this.plannerService.startRoutingAPI(data).subscribe((response) => {
      //console.log(response);
      this.optimizedRoutes = response.slice();
      let res = response.unshift([]);
      this.ordersToVehicle = response.slice();
      this.isOptimized = true;
      //this.traceAllRoutes(this.ordersToVehicle);
      this.messageService.add({severity:'success', summary: 'Successful', detail: 'ROUTING SUCCESS', life: 13000});
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

  async traceRouteOnMap(route: any[], color: string) {
    let start: {lat: number | undefined, lng: number | undefined} = {lat: this.depot.lat, lng: this.depot.lng}
    for(let i = 0; i < route.length; i++) {
      let end = {lat: this.orders.find(order => order.id === route[i])?.locationlatitude, lng: this.orders.find(order => order.id === route[i])?.locationlongitude}
      await this.requestRouteDirection(start, end, color);
      start = end;
    }
    //Du dernier point au dépot
    let end = {lat: this.depot.lat, lng: this.depot.lng};
    start = {lat: this.orders.find(order => order.id === route[route.length-1])?.locationlatitude, lng: this.orders.find(order => order.id === route[route.length-1])?.locationlongitude};
    await this.requestRouteDirection(start, end, color);
  }


  requestRouteDirection(start: any, end: any, color: string) {
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    let destination = end;
    let origin = start;
    const request =  {
      origin: origin,
      destination: destination,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    }
    return directionsService.route(request, (res: any, status: any) => {
      if(status == 'OK') {
          directionsDisplay.setOptions({
            polylineOptions: {
              strokeColor: color
            }
          });
          directionsDisplay.setDirections(res);
          this.overlays.push(directionsDisplay);
      } else {
        if (status == 'ZERO_RESULTS') {
          alert('No route could be found between the origin and destination.');
        } else if (status == 'UNKNOWN_ERROR') {
          alert('A directions request could not be processed due to a server error. The request may succeed if you try again.');
        } else if (status == 'REQUEST_DENIED') {
          alert('This webpage is not allowed to use the directions service.');
        } else if (status == 'OVER_QUERY_LIMIT') {
          alert('The webpage has gone over the requests limit in too short a period of time.');
        } else if (status == 'NOT_FOUND') {
          alert('At least one of the origin, destination, or waypoints could not be geocoded.');
        } else if (status == 'INVALID_REQUEST') {
          alert('The DirectionsRequest provided was invalid.');
        } else {
          alert("There was an unknown error in your request. Requeststatus: \n\n"+status);
        }
      }
    })
  }


  traceRouteForVehicle(vehicle: Vehicle) {
    const colorRoad = ['red', 'blue', 'orange', 'green', 'black'];
    this.traceRouteOnMap(this.optimizedRoutes[vehicle.id-1], colorRoad[vehicle.id-1]);
  }

  async traceAllRoutes(routes: number[][]) {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const colorRoad = ['red', 'blue', 'orange', 'green', 'black'];
    for(let i = 0; i < routes.length; i++ ) {
      this.traceRouteOnMap(routes[i], colorRoad[i]);
      delay(2000);
    }
  }


  openModalRoute(vehicle: Vehicle) {
    const colorRoad = ['red', 'blue', 'orange', 'green', 'black'];
    let optimizedRoute = this.optimizedRoutes[vehicle.id-1];
    let color = colorRoad[vehicle.id-1];
    let orders = this.orders.slice().filter(e => optimizedRoute.includes(e.id));
    console.log(orders);
    this.ref = this.dialogService.open(PlannerDetailComponent, {
      modal: true,
      height: '70%',
      width: '90%',
      data: {
        vehicle,
        orders,
        optimizedRoute,
        color
      }
    })
  }

}
