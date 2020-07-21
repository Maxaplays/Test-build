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
  public getResumen(ID_CRE: string) {
    return this.getQuery( `Resumen/${ID_CRE}`);
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

  // Patrimonio total
  public getguardarValorMuebles(idCre: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorMuebles?idCre=${idCre}&valor=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarComentarioMuebles(idCre: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioMuebles?idCre=${idCre}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarValorPropiedades(idCre: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorPropiedades?idCre=${idCre}&valor=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarComentarioPropiedades(idCre: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioPropiedades?idCre=${idCre}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarValorVehiculos(idCre: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorVehiculos?idCre=${idCre}&valor=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarComentarioVehiculos(idCre: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioVehiculos?idCre=${idCre}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarValorInversiones(idCre: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorInversiones?idCre=${idCre}&valor=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarComentarioInversiones(idCre: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioInversiones?idCre=${idCre}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarValorAcciones(idCre: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorAcciones?idCre=${idCre}&valor=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarComentarioAcciones(idCre: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioAcciones?idCre=${idCre}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarValorDeudas(idCre: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorDeudas?idCre=${idCre}&valor=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarComentarioDeudas(idCre: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioDeudas?idCre=${idCre}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarValorTarjetas(idCre: string, valor: string, usuario: string) {
    const urlIngresos = `/guardarValorTarjetas?idCre=${idCre}&valor=${valor}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getguardarComentarioTarjetas(idCre: string, comentario: string, usuario: string) {
    const urlIngresos = `/guardarComentarioTarjetas?idCre=${idCre}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlIngresos);
  }

  public getTotalPatrimonio(idCre: string) {
    const urlIngresos = `/totalPatrimonio?idCre=${idCre}`;
    return this.getQuery(urlIngresos);
  }
}
