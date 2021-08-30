import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators'
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = 'http://localhost:3000/orders'

  constructor(private httpClient: HttpClient) { }

  getAllOrder(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseUrl).pipe(retry(3), catchError(this.handleError))
  }

  exportOrders() {
    return this.httpClient.get(`${this.baseUrl}/download`, {responseType: 'blob'}).pipe(catchError(this.handleError));
  }

  addNewOrder(data: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.baseUrl, data).pipe( catchError(this.handleError) );
  }

  updateOrder(data: Order, id: any): Observable<Order> {
    return this.httpClient.put<Order>(`${this.baseUrl}/${id}`, data).pipe( catchError(this.handleError) );
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`).pipe( catchError(this.handleError) );
  }

  deletedOrdersSelected(ids: number[]): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/many/${ids}`).pipe(catchError(this.handleError));
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
