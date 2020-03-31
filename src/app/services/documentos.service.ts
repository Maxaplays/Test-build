import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  constructor(private http: HttpClient) {
    console.log('DocumentosService');
  }
  private getQuery(query: string) {
    const urlDocumentos = 'documentos/';
    const url = environment.urlServiciosBackend + urlDocumentos + query;
    console.log('DocumentosService: '+ url);
    return this.http.get(url);
  }

  public getEntidadFinanciera(){
    return this.getQuery('EntidadFinanciera');
  }
  public getTipoCuenta(id_banco: string){
    return this.getQuery(`TipoCuenta/${id_banco}`);
  }
  public getNumeroCuenta(id_banco: string, cod_tcu : string){
    return this.getQuery(`NumeroCuenta/${id_banco},${cod_tcu}`);
  }
}
