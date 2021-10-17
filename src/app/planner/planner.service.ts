import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Order } from '../models/order';
import { Vehicle } from '../models/vehicle';
import { baseUrlPlanner } from '../url';

@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  constructor(
    private httpClient: HttpClient
  ) { }

  startRoutingTaboo(data: any): Observable<any> {
    return this.httpClient.post<any>(baseUrlPlanner + '/taboo',data).pipe( catchError(this.handleError) );
  }

  startRoutingTabooCrossMove(data: any): Observable<any> {
    return this.httpClient.post<any>(baseUrlPlanner + '/taboo_cross_move',data).pipe( catchError(this.handleError) );
  }

  startRoutingGreedyAlgorithm(data: any): Observable<any> {
    return this.httpClient.post<any>(baseUrlPlanner + '/greedy',data).pipe( catchError(this.handleError) );
  }

  getAllOrder(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(baseUrlPlanner + '/orders').pipe(retry(1), catchError(this.handleError))
  }

  getVehiclesRas(): Observable<Vehicle[]> {
    return this.httpClient.get<Vehicle[]>(`${baseUrlPlanner}/vehicles`).pipe(retry(1), catchError(this.handleError));
  }

  dispatchRouteToVehicle(data: any): Observable<any> {
    return this.httpClient.post<any>(baseUrlPlanner + '/vehicleDispatch', data).pipe( catchError(this.handleError) );
  }

  getDispatchRouteToVehicle():Observable<any> {
    return this.httpClient.get<any>(baseUrlPlanner + '/vehicleDispatch').pipe(catchError(this.handleError));
  }


  reset() {
    return this.httpClient.put(baseUrlPlanner + '/reset', {}).pipe(catchError(this.handleError))
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
