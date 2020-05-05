import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentosVisualizacionService {

  constructor( private http: HttpClient) { }

  private getQuery(query: string) {
    const urlDocumentos = 'DocumentosVisualizacion/';
    const url = environment.urlServiciosBackend + urlDocumentos +  query;
    console.log('TipoDirService: ' + url);
    return this.http.get(url);
  }

  public getRequisitos(ID_CRE: string, ID_CLI: string) {
    return this.getQuery(`${ID_CRE}/${ID_CLI}/1`);
  }

  public getPoliticas(ID_CRE: string, ID_CLI: string) {
    return this.getQuery(`${ID_CRE}/${ID_CLI}/2`);
  }

  public getControlCalidad(ID_CRE: string, ID_CLI: string) {
    return this.getQuery(`${ID_CRE}/${ID_CLI}/3`);
  }
}
