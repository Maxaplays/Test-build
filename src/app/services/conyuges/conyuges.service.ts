import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConyugesService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor( private http: HttpClient ) { }

  private getQuery(query: string) {
    const urlConyuges = 'conyuges/';
    const url = environment.urlServiciosBackend + urlConyuges +  query;
    return this.http.get(url);
  }

  public getConyugeCedula(cedula: string) {
    const url = environment.urlServiciosBackend + `conyuges/getConyuge?cedula=${cedula}`;
    return this.http.get(url);
  }

  public getListaConyuges(ID_CLI: string) {
    return this.getQuery(`${ID_CLI}`);
  }

  public postConyuge(valoresSimulador: Conyuge) {
    // console.log(valoresSimulador);
    const url = environment.urlServiciosBackend + `conyuges/guardarConyuge`;
    return this.http.post<Conyuge>(url, valoresSimulador, this.httpOptions)
      .pipe(
        catchError(this.handleError('postConyuge', valoresSimulador))
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

 // CED_COD, ID_CLI, COD_GEN, COD_TDOC, APE_CON, NOM_CON, FECH_NAC_CON, OBSERVACIONES_CON, DIR_TRAB_CON, ESTADO_CON, USR_CON
export class Conyuge {
  CED_CON: string;
  ID_CLI: string;
  COD_GEN: string;
  COD_TDOC: string;
  APE_CON: string;
  NOM_CON: string;
  FECH_NAC_CON: string;
  OBSERVACIONES_CON: string;
  DIR_TRAB_CON: string;
  ESTADO_CON: string;
  usuario: string;
  telefono: string;
  COD_NAC: string;
  COD_PRO: string;
  tipodoc: string;
  genero: string;
  ID_CON: string;
}