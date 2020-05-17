import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenciasService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor( private http: HttpClient ) { }

  private getQuery(query: string) {
    const urlReferencias = 'referencias/';
    const url = environment.urlServiciosBackend + urlReferencias +  query;
    return this.http.get(url);
  }

  public getListaReferencias(ID_CLI: string) {
    return this.getQuery(`${ID_CLI}`);
  }

  public postReferencias(referencia: Referencia, nuevo: boolean) {
    if (nuevo) {
      referencia.Nuevo = false;
    }
    const url = environment.urlServiciosBackend + `referencias/nuevaDireccion`;
    return this.http.post<Referencia>(url, referencia, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', referencia))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
export class Referencia {
  xcedula: string;
  xapellido: string;
  xnombre: string;
  xdireccion: string;
  xtelefono: string;
  Nuevo: boolean;
  ID_REF: number;
}