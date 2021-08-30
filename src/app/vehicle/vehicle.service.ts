import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Vehicle } from '../models/vehicle';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  baseUrl = 'http://localhost:3000/vehicles';

  constructor(private httpClient: HttpClient) { }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.httpClient.get<Vehicle[]>(this.baseUrl).pipe(retry(3), catchError(this.handleError));
  }

  getVehiclesRas(): Observable<Vehicle[]> {
    return this.httpClient.get<Vehicle[]>(`${this.baseUrl}/ras`).pipe(retry(3), catchError(this.handleError));
  }

  exportVehicles() {
    return this.httpClient.get(`${this.baseUrl}/download`, {responseType: 'blob'}).pipe(catchError(this.handleError));
  }

  addNewVehicle(data: Vehicle): Observable<Vehicle> {
    return this.httpClient.post<Vehicle>(this.baseUrl, data).pipe(catchError(this.handleError));;
  }

  updateVehicle(data: Vehicle, id: any): Observable<Vehicle> {
    return this.httpClient.put<Vehicle>(`${this.baseUrl}/${id}` , data).pipe(catchError(this.handleError));;
  }

  deleteVehicleById(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  deletedVehiculesSelected(ids: number[]): Observable<any> {
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
