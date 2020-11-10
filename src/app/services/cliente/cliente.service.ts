import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  public postCliente(valoresSimulador: Cliente) {
    // console.log(valoresSimulador);
    const url = environment.urlServiciosBackend + `Cliente/guardarCliente`;
    return this.http.post<Cliente>(url, valoresSimulador, this.httpOptions)
      .pipe(
        catchError(this.handleError('postCliente', valoresSimulador))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  public getClienteCedula(cedula: string) {
    const url = environment.urlServiciosBackend + `Cliente/getCliente?cedula=${cedula}`;
    return this.http.get(url);
  }
}
export class Cliente {
        ID_CLI: string;
        COD_GEN: string;
        COD_ECIV: string;
        COD_PRO: string;
        COD_TDOC: string;
        COD_NAC: string;
        APE_CLI: string;
        NOM_CLI: string;
        FECH_NAC_CLI: string;
        CARGAS_CLI: string;
        EMP_CLI: string;
        RUC_EMP_CLI: string;
        TIP_CLI: string;
        EMAIL_CLI: string;
        EstadoOperacion: string;
        INGRESOS_DEPENDIENTE: string;
        INGRESOS_INDEPENDIENTE: string;
        usuario: string;
        credito: string;
}
