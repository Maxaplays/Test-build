import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Telefono} from './telefonos/telefonos.service';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {
    // console.log('DocumentosService');
  }
  private getQuery(query: string) {
    const urlDocumentos = 'documentos/';
    const url = environment.urlServiciosBackend + urlDocumentos + query;
    // console.log('DocumentosService: '+ url);
    return this.http.get(url);
  }

  public getEntidadFinanciera() {
    return this.getQuery('EntidadFinanciera');
  }
  public getTipoCuenta() {
    return this.getQuery(`TipoCuenta`);
  }
  public getNumeroCuenta(id_banco: string, cod_tcu : string) {
    return this.getQuery(`NumeroCuenta/${id_banco},${cod_tcu}`);
  }
  public getDocumentosSubidos(idCredito: string) {
    return this.getQuery(`getDocumentos?idCredito=${idCredito}`);
  }
  public postFileImagen (archivos: File[], ID_CRE: string, USR_DOC: string) {
    const url = environment.urlServiciosBackend + `Documentos/nuevoDocumento/${ID_CRE}/${USR_DOC}`;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    for ( let i = 0; i < archivos.length ; i++) {
      formData.append(archivos[i].name, archivos[i]);
    }
    return this.http.post<File>(url, formData);
  }

  public entregarCarpeta(idCredito: string, clave: string, persona: string) {
    const carpeta: Carpeta = new Carpeta();
    carpeta.idCredito = idCredito;
    carpeta.clave = clave;
    carpeta.persona = persona;
    carpeta.usuario = localStorage.getItem('usuario');
    const url = environment.urlServiciosBackend + 'documentos/entregarCarpeta';

    return this.http.post<Carpeta>(url, carpeta, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', carpeta))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}

export class Carpeta {
  idCredito: string;
  clave: string;
  persona: string;
  usuario: string;
}
