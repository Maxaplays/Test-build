import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SituacionFinancieraService {

  constructor( private http: HttpClient ) { }

  private getQuery(query: string) {
    const urlIngresos = 'ServiciosFinancieros/';
    const url = environment.urlServiciosBackend + urlIngresos +  query;
    return this.http.get(url);
  }

  public getIngresos(ID_CRE: string) {
    return this.getQuery( `Ingresos/${ID_CRE}`);
  }
}
