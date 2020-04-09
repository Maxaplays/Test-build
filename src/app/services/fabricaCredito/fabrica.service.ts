import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FabricaService {
  public isAutenticated: boolean;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {
    //console.log('Servicio Inicializado');
  }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    //console.log(url);
    return this.http.get(url);
  }
  
  public getEnvioFabricaServiceBi (hero: EnvioFabricaServiceBi) {
    const url = environment.urlServiciosBackend + 'FabricaCredito/' + hero.cedula ;
    return this.http.get(url);
  }

}
export class EnvioFabricaServiceBi {
  tipoDocumento: string;
  cedula: string;
  estadoCivil: string;
  fechaNacimiento: string;
}