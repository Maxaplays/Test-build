import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Direccion} from '../direcciones/direcciones.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentosVisualizacionService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor( private http: HttpClient) { }

  private getQuery(query: string) {
    const urlDocumentos = 'DocumentosVisualizacion/';
    const url = environment.urlServiciosBackend + urlDocumentos +  query;
    // console.log('TipoDirService: ' + url);
    return this.http.get(url);
  }

  public getRequisitos(ID_CRE: string, ID_CLI: string) {
    return this.getQuery(`${ID_CRE}/${ID_CLI}/1`);
  }

  public getPoliticas(ID_CRE: string, ID_CLI: string) {
    return this.getQuery(`${ID_CRE}/${ID_CLI}/2`);
  }

  public getControlCalidad(ID_CRE: string, ID_CLI: string) {
    return this.getQuery(`${ID_CRE}/${ID_CLI}/3`);
  }

  public getExcepciones(ID_VAL: string) {
    return this.getQuery(`Exepcion/${ID_VAL}`);
  }

  public postExcepcion(excepcion: Excepcion) {
    const url = environment.urlServiciosBackend + `/DocumentosVisualizacion/NuevaExepcion`;
    return this.http.post<Excepcion>(url, excepcion, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', excepcion))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  public getDocumentosEnviar(usuario: string) {
    return this.getQuery(`obtenerDocumentosEnviar/${usuario}`);
  }

  public postCreditosEnviar(creditos: any, usuario: string) {
    const url = environment.urlServiciosBackend + `/DocumentosVisualizacion/DocumentosEnviar/${usuario}`;
    return this.http.post<Excepcion>(url, creditos, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', creditos))
      );
  }
}

export class Excepcion {
  ID_VPOL: number;
  USR_EXC_VAL: string;
  OBSER_VAL_EXC_VAL: string ;
  IDE_CRE: string;
  Tipo: string;
}
