import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Order } from '../models/order';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  baseUrl = 'http://localhost:3000/planner'

  constructor(
    private httpClient: HttpClient
  ) { }

  startRoutingAPI(data: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl,data).pipe( catchError(this.handleError) );
  }

  getAllOrder(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseUrl + '/orders').pipe(retry(1), catchError(this.handleError))
  }

  getVehiclesRas(): Observable<Vehicle[]> {
    return this.httpClient.get<Vehicle[]>(`${this.baseUrl}/vehicles`).pipe(retry(1), catchError(this.handleError));
  }

  dispatchRouteToVehicle(data: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/vehicleDispatch', data).pipe( catchError(this.handleError) );
  }

  getDispatchRouteToVehicle():Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/vehicleDispatch').pipe(catchError(this.handleError));
  }


  handleError(error: HttpErrorResponse) {
    if(error.error instanceof ErrorEvent) {
      console.error('An error occured ', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was ${error.error} and message is ${error.error.message}`);
    }
    return throwError('Something bad happened; please try again later');
  }
}
