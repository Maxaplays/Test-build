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
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  public postArchivo(archivo: File) {
    console.log(archivo);
    const url = environment.urlServiciosBackend + `Archivos/nuevoArchivo`;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post<File>(url, formData);


  }
}
