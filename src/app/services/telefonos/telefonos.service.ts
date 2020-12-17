import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TelefonosService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor( private http: HttpClient ) { }

  private getQuery(query: string) {
    const urlTelefonos = 'telefonos/';
    const url = environment.urlServiciosBackend + urlTelefonos + query;
    return this.http.get(url);
  }

  public getTipoTelefonos() {
    return this.getQuery('tipotelefono');
  }

  public getTelefonos(ID_CLI: string) {
    return this.getQuery(`${ID_CLI}`);
  }

  public postTelefono(COD_TDIS: string, ID_CLI: string, VALOR_DIS: string, EXTEN_DIS: string, ID_DIS: number, Nuevo: boolean, USR_DIS: string) {
    const telefono: Telefono = new Telefono();
    telefono.COD_TDIS = COD_TDIS;
    telefono.ID_CLI = ID_CLI;
    telefono.VALOR_DIS = VALOR_DIS;
    telefono.EXTEN_DIS = EXTEN_DIS;
    telefono.ID_DIS = ID_DIS;
    telefono.Nuevo = Nuevo;
    telefono.USR_DIS = USR_DIS;
    const url = environment.urlServiciosBackend + 'telefonos/nuevoTelefono';

    return this.http.post<Telefono>(url, telefono, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', telefono))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}

export class Telefono {
  COD_TDIS: string;
  ID_CLI: string;
  VALOR_DIS: string;
  EXTEN_DIS: string;
  ID_DIS: number;
  Nuevo: boolean;
  USR_DIS: string;
}
