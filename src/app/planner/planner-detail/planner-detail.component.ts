import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Order } from 'src/app/models/order';
declare var google: any;

@Component({
  selector: 'app-planner-detail',
  templateUrl: './planner-detail.component.html',
  styleUrls: ['./planner-detail.component.scss']
})
export class PlannerDetailComponent implements OnInit {

  options: any;
  overlays: any[] = [];
  map!: any;
  depot = {
    lat: 5.36964,
    lng:  -3.97025
  };

  constructor(
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.initMap();
    this.loadOrderForMap(this.config.data.orders);
    this.computeTimeOfDelivery();
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
}

  async getMap(map: any) {
    this.map = map;
    await this.traceRouteOnMap(this.config.data.optimizedRoute, this.config.data.color);
  }


  async traceRouteOnMap(route: any[], color: string) {
    let start: {lat: number | undefined, lng: number | undefined} = {lat: this.depot.lat, lng: this.depot.lng}
    for(let i = 0; i < route.length; i++) {
      let end = {lat: this.config.data.orders.find((order: Order) => order.id === route[i])?.locationlatitude, lng: this.config.data.orders.find((order: Order) => order.id === route[i])?.locationlongitude}
      await this.requestRouteDirection(start, end, color);
      start = end;
    }
    //Du dernier point au dépot
    let end = {lat: this.depot.lat, lng: this.depot.lng};
    start = {lat: this.config.data.orders.find((order:Order) => order.id === route[route.length-1])?.locationlatitude, lng: this.config.data.orders.find((order: Order) => order.id === route[route.length-1])?.locationlongitude};
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

  computeTimeOfDelivery() {
    let route = this.config.data.optimizedRoute;
    let orders = this.config.data.orders as Order[];
    let distanceMatrixService = new google.maps.DistanceMatrixService();
    let start = [this.depot.lat, this.depot.lng];
    let end =[orders.find(el => el.id == route[0])?.locationlatitude, orders.find(el => el.id == route[0])?.locationlongitude]
    let request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }
    distanceMatrixService.getDistanceMatrix(request, (result: any, status: any) => {
      if(status === 'OK') {
        console.log(result)
        console.log(result.rows.elements)
      } else {
        console.log('other problems')
      }
    })
  }

}
