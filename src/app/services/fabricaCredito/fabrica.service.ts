import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FabricaService {
  public isAutenticated: boolean;
  private messageSource = new BehaviorSubject<DatosFabrica>(new DatosFabrica());
  currentMessage = this.messageSource.asObservable();


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {
    // console.log('Servicio Inicializado');
  }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    console.log(url);
    return this.http.get(url);
  }
  public getEnvioFabricaServiceBi(datosParaEnviar: EnvioFabricaServiceBi) {
    const url = environment.urlServiciosBackend + `FabricaCredito?Identificacion=${datosParaEnviar.cedula}&TipoDocumentacion=${datosParaEnviar.tipoDocumento}&IngresosIndependiente=${datosParaEnviar.IngresosIndependiente}&IngresoDependiente=${datosParaEnviar.IngresoDependiente}&VentaTotal=${datosParaEnviar.VentaTotal}&Producto=${datosParaEnviar.Producto}&IdSucursal=${datosParaEnviar.IdSucursal}&Usuario=${datosParaEnviar.Usuario}`;
    return this.http.get(url);
  }
  public getcalcularValoresSimulador(valoresSimulador: ValoresSimulador) {
    console.log(valoresSimulador);
    const url = environment.urlServiciosBackend + `FabricaCredito/calcularValoresSimulador`;
    return this.http.post<ValoresSimulador>(url, valoresSimulador, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', valoresSimulador))
      );
  }
  changeMessage(message: DatosFabrica) {
    this.messageSource.next(message);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }
}
export class EnvioFabricaServiceBi {
  tipoDocumento: string;
  cedula: string;
  estadoCivil: string;
  fechaNacimiento: string;
  IngresosIndependiente: string;
  IngresoDependiente: string;
  VentaTotal: string;
  Producto: string;
  IdSucursal: string;
  Usuario: string;
}
export class ValoresSimulador{
  idCredito: string;
  seMonto: number;
  lblPerfilCliente: string;
  cmbProducto: string;
  lblSucursal: string;
  seVentaTotalAplicada: number;
  seMontoSugerido: number;
  seEntrada: number;
  seValorTotal: number;
  sePlazo: number;
  seTasa: number;
  lblPlazoSugerido: number;
  tipoValidacion: string;
  relacionLaboral: string;
  seCuotaFija: string;
  TipoId: string;
  PerfilAplicado: string;
  MontoAprobado: number;
  usuario: string;
  ruc: string;
  entradaAplicada: number;
  capacidadPagoSugerida: number;
  EstadoCivil: string;
  IngresoValidado: string;
  BaseUrl: string;
  nombreConsultado: string;
  fechaNacimiento: string;
  resultado: string;
}
export class DatosFabrica {
  public CapacidadPagoSugerida: string;
  public Condicion: string;
  public CreditoCabecera: string;
  public CuentasMupi: string;
  public CuotaFija: string;
  public CuotaMensual: string;
  public DiasInicioCredito: string;
  public DiasInicioMaximoCredito: string;
  public Entrada: string;
  public EntradaAplicada: string;
  public EntradaSugerida: string;
  public Error: string;
  public FechaNacimiento: string;
  public FechaPagareMax: string;
  public FechaPagareMin: string;
  public GastoFinanciero: string;
  public GastoHogar: string;
  public IngresoValidado: string;
  public idProducto: string;
  public idSucursal: string;
  public Monto: string;
  public MontoAprobado: string;
  public MontoMax: string;
  public MontoMin: string;
  public MontoSugerido: string;
  public MontosAplicados: string;
  public NombreConsultado: string;
  public NumeroCredito: string;
  public Perfil: string;
  public PerfilAplicado: string;
  public PerfilAplicadoCabecera: string;
  public Plazo: string;
  public PlazoSugerido: string;
  public PorcentajeEntrada: string;
  public PorcentajeEntradaAplicada: string;
  public PorcentajeEntradaSugerida: string;
  public PorcentajeEntradaSugerida1: string;
  public Respuesta: string;
  public RiesgoAcumulado: string;
  public ScoreDeudor: string;
  public Tasa: string;
  public TasaMax: string;
  public TasaMin: string;
  public ValorEntradaCabecera: string;
  public ValorTotal: string;
  public ValorTotalMax: string;
  public ValorTotalMin: string;
  public VentaCabecera: string;
  public ventaMaxSugerida: string;
  public SubEstado: string;
  public TipoCredito: string;
  public Cedula: string;
  public Estado: string;
  public FechaCreacion: string;
  public AsesorAsociado: string;
}