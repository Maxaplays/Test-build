import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor( private http: HttpClient ) { }

  private getQuery(query: string) {
    const urlDirecciones = 'direcciones/';
    const url = environment.urlServiciosBackend + urlDirecciones +  query;
    return this.http.get(url);
  }

  public getTipoDir() {
    return this.getQuery('TipoDireccion');
  }

  public getProvincia() {
    return this.getQuery('Provincias');
  }

  public getCanton(COD_PROV: string) {
    return this.getQuery(`Cantones/${COD_PROV}`);
  }

  public getParroquia(COD_CAN: string) {
    return this.getQuery(`Parroquias/${COD_CAN}`);
  }

  public getBarrio(COD_PAR: string) {
    return this.getQuery(`Barrios/${COD_PAR}`);
  }

  public getDirecciones(ID_CLI: string, ID_CRE: string, ID_CONYUGE: string) {
    return this.getQuery(`${ID_CLI}/${ID_CRE}/${ID_CONYUGE}`);
}
  public getDatosMap(datos){
    const urlDirecciones = 'direcciones/mapa';
    const url = environment.urlServiciosBackend + urlDirecciones ;
    return this.http.post(url,datos).toPromise();
  }

  public postDireccion(direccion: Direccion, nuevo: boolean) {
    if (nuevo === false) {
      direccion.Nuevo = false;
    }
    const url = environment.urlServiciosBackend + `direcciones/nuevaDireccion`;
    return this.http.post<Direccion>(url, direccion, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', direccion))
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

export class Direccion {
  tipoRegistro: string;
  tipoDireccion: string;
  Provincia: string;
  Canton: string;
  Parroquia: string;
  Barrio: string;
  CallePrincipal: string;
  NumeroCalle: string;
  CalleSecundaria: string;
  Referencia: string;
  CodigoPostal: string;
  Cedula: string;
  Nuevo: boolean;
  ID_DIR: number;
  Usuario: string;
  Latitud: string;
  Longitud: string;
}
