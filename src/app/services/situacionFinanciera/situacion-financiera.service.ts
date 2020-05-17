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
  public getguardarComentarioIngresos(idReg: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioIngresos?idReg=${idReg}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }
  public getguardarValorIngresos(idReg: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorIngresos?idReg=${idReg}&comentario=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }
  public getEgresos(ID_CRE: string) {
    return this.getQuery( `Egresos/${ID_CRE}`);
  }
  public getguardarComentarioEgresos(idReg: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioEgresos?idReg=${idReg}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }
  public getguardarValorEgresos(idReg: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorEgresos?idReg=${idReg}&comentario=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }
}
