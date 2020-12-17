import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Direccion} from '../direcciones/direcciones.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  public postArchivo(archivos: File[], ID_CRE: string, USR_DOC: string, NOM_DOC: string, Validacion: string, Tipo: string) {
    /*console.log('paso');*/
    const url = environment.urlServiciosBackend + `Archivos/nuevoArchivo/${ID_CRE}/${USR_DOC}/''/${Validacion}/${Tipo}`;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    for ( let i = 0; i < archivos.length ; i++) {
      formData.append(archivos[i].name, archivos[i]);
    }
    return this.http.post<File>(url, formData);
  }
}


