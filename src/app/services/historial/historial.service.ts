import {Injectable, Input} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FabricaService} from '../fabricaCredito/fabrica.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Direccion} from '../direcciones/direcciones.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor( private http: HttpClient,
               private fabricaService: FabricaService) { }

  private getQuery(query: string) {
    const urlHistorial = 'historial/';
    const url = environment.urlServiciosBackend + urlHistorial + query;
    return this.http.get(url);
  }

  public getHistorial(ID_CRE: string,ID_HIST: string) {
    return this.getQuery(`${ID_CRE}/${ID_HIST}`);
  }

  public getEstadoSubEstado(ID_CRE: string) {
    return this.getQuery(`estado/${ID_CRE}`);
  }

  public postComentario(historial: Historial) {
    const url = environment.urlServiciosBackend + `historial`;
    return this.http.post<Direccion>(url, historial, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', historial))
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

export class Historial {
  ID_CRE: string;
  DES_HIST: string;
  USR_HIST: string;
}
