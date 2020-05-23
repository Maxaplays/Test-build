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
    return this.http.get(url);
  }

  public getTipoTelefonos() {
    return this.getQuery('tipotelefono');
  }

  public getTelefonos(ID_CLI: string) {
    return this.getQuery(`${ID_CLI}`);
  }

  public postTelefono(COD_TDIS: string, ID_CLI: string, VALOR_DIS: string, EXTEN_DIS: string, ID_DIS: number, Nuevo: boolean, USR_DIS: string) {
    return this.getQuery(`${COD_TDIS},${ID_CLI},${VALOR_DIS},${EXTEN_DIS},${ID_DIS},${Nuevo},${USR_DIS}`);
  }
}
