import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  handleError(error: HttpErrorResponse) {
    if(error.error instanceof ErrorEvent) {
      console.error('An error occured ', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was ${error.error} and message is ${error.error.message}`);
    }
    return throwError('Something bad happened; please try again later');
  }
}
