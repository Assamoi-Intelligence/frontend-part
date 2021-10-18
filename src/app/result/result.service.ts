import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AlgorithmResult } from '../models/algorithm';
import { Detail } from '../models/detail';
import { baseUrlAlgorithm } from '../url';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http: HttpClient) { }

  getAlgorithmResults(): Observable<AlgorithmResult[]> {
    return this.http.get<AlgorithmResult[]>(baseUrlAlgorithm).pipe(retry(1), catchError(this.handleError));
  }

  getDetailTabuSearch(): Observable<Detail[]> {
    return this.http.get<Detail[]>(baseUrlAlgorithm + '/tabu-search').pipe(retry(1), catchError(this.handleError));
  }

  getDetailTabuSearchCrossMove(): Observable<Detail[]> {
    return this.http.get<Detail[]>(baseUrlAlgorithm + '/tabu-search/cross-move').pipe(retry(1), catchError(this.handleError));
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
