import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneraDocService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    return this.http.get(url);
  }
  public postGeneracionDocumentos(valores: GeneracionDocumentos) {
    // console.log(valoresSimulador);
    const url = environment.urlServiciosBackend + `GeneracionDocumentos/generarDocumentos`;
    return this.http.post<GeneracionDocumentos>(url, valores, this.httpOptions)
      .pipe(
        catchError(this.handleError('postCliente', valores))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  public getReportesDisponibles(idCredito: string, idProducto: string, idSucursal: string ) {
    return this.getQuery(`GeneracionDocumentos/generarReportesDisponibles?idCredito=${idCredito}&idProducto=${idProducto}&idSucursal=${idSucursal}`);
  }

  public getEstadoGenerarDocumentacion(idCredito: string) {
    return this.getQuery(`GeneracionDocumentos/estadoGenerarDocumentacion?idCredito=${idCredito}`);
  }
}
export class GeneracionDocumentos {
    ID_CRE: string;
    reportesImprimir: Array<ReporteWebserviceUx>;
    fechaPagare: string;
    fechaPrimerPago: string;
    entidadFinanciera: string;
    TipoDeCuenta: string;
    NumeroCuentaBancaria: string;
    urlArchivoGenerado: string;
    resultado: string;
    respuestaTablaAmortizacion: string;
    lblCuentasMupi: string;
    usuario: string;
    ID_CLI: string;
    UsaFirmaElectronica: string;

    constructor() {
      this.reportesImprimir = new Array<ReporteWebserviceUx>();
    }
}
export class ReporteWebserviceUx
{
    nombreArchivo: string;
    nombreReporte: string;
    selected: boolean;
}
