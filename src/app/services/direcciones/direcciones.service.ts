import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  constructor( private http: HttpClient ) { }

  private getQuery(query: string) {
    const urlDirecciones = 'direcciones/';
    const url = environment.urlServiciosBackend + urlDirecciones +  query;
    console.log('TipoDirService: ' + url);
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
}

