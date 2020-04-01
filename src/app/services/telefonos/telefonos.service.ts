import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelefonosService {

  constructor( private http: HttpClient ) { }

  private getQuery(query: string) {
    const urlTelefonos = 'telefonos/';
    const url = environment.urlServiciosBackend + urlTelefonos + query;
    console.log('Telefonos : ' + url);
    return this.http.get(url);
  }

  public getTipoTelefonos() {
    return this.getQuery('tipotelefono');
  }

  public getTelefonos(ID_CLI: string) {
    return this.getQuery(`telefonos/${ID_CLI}`);
  }
}
