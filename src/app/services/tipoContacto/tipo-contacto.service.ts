import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoContactoService {

  constructor(private http: HttpClient) {
    // console.log('Servicio Inicializado');
  }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    // console.log(url);
    return this.http.get(url);
  }
  public getTipoContacto() {
    return this.getQuery(`TipoContacto`);
  }
}
