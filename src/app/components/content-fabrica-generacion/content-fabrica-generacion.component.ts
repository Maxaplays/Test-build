import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DocumentosService } from '../../services/documentos.service';
import { map } from 'rxjs/operators';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneracionDocumentos, GeneraDocService, ReporteWebserviceUx } from '../../services/generaDoc/genera-doc.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-fabrica-generacion',
  templateUrl: './content-fabrica-generacion.component.html',
  styleUrls: ['./content-fabrica-generacion.component.css']
})
export class ContentFabricaGeneracionComponent implements OnInit {

  private _error = new Subject<string>();
  private _success = new Subject<string>();
  errorMessage: string;
  successMessage: string;
  advertenceMessage: string;
  NOMBRE_BANCO: string;
  TIPO_BANCO: string;
  closeResult: string;
  listadoErrores: string[];
  EntidadFinanciera: any[] = [];
  TipoCuenta: any[] = [];
  NumeroCuenta: any[] = [];
  documentosSubidos: any[] = [];
  loading: boolean;
  // bkm
  mensajeServicio: DatosFabrica;
  urlArchivoGenerado: string;
  tipoReportes: ReporteWebserviceUx[];
  arregloReportes = new Array<ReporteWebserviceUx>();
  FormularioDatosReportes: FormGroup;
  numeroCuentaEnabled = true;
  entidadFinancieraEnabled = true;
  tipoCuentaEnabled = true;
  FechaPagareMax: Date;
  FechaPagareMin: Date;
  FechaPrimerPagoMax: Date;
  FechaPrimerPagoMin: Date;
  btnSolicitarAnulacion = true;
  SubirArchivos = true;
  generarDocumentacion = true;
  firmaElectronica = false;
  puedeCambiarFechas: boolean = false;
  Archivos: File[] = [];
  archivoSeleccionado: File = null;
  estadoGeneracion: boolean = false;
  mostrar: boolean = false;
  @Input() idCre: string;
  idCredito: string;
  // bkm
  minDate: Date;
  maxDate: Date;
  temporal: any = "";
  diaIngresado: String = "";
  mesIngresado: String = "";
  yearIngresado: String = "";
  FechaActual: Date;
  FechaCambio: String;
  
  primerIngreso:boolean= false;

  diaIngresado2: String = "";
  mesIngresado2: String = "";
  yearIngresado2: String = "";
  FechaActual2: Date;
  FechaCambio2: String;
  constructor(private modalService: NgbModal,
    private documentosService: DocumentosService,
    private fabricaService: FabricaService,
    private generacionDocs: GeneraDocService,
    private router: Router) { }
  ngOnInit() {
    this.initForm();
    if (this.idCre !== undefined && this.idCre !== '') {
      this.idCredito = this.idCre;
      // console.log('Solicitud de credito:' + this.idCredito);
      if (this.idCredito !== 'undefined' && this.idCredito !== 'undefined' && this.idCredito !== '') {
        if (typeof this.idCredito !== 'undefined' && this.mensajeServicio === undefined) {
          this.fabricaService.getRetomarCredito(this.idCredito,
            localStorage.getItem('usuario')).pipe(map(data => data['Table1'][0])).subscribe(
              (data: DatosFabrica) => {
                // console.log(data);
                this.fabricaService.changeMessage(data);
                // console.log('Acoplar Pantalla: ' + data.Estado);
                // this.acoplarPantalla(data.Estado);
              });
        }
        this.fabricaService.currentMessage.subscribe(
          data => {
            this.mensajeServicio = data;
            this.firmaElectronica = Boolean(this.mensajeServicio.UsaFirmaElectronica);
            this.acoplarPantalla(this.mensajeServicio.Estado);
            this.getTipoReportes();
            this.getEstadoGenerarDocumentacion();
          });
      }
    }
    this.getEntidadFinanciera();
    this.getTipoCuenta();
    this.inicializarDatosCuentas();
    const currentYear = new Date().getFullYear();
    const Mont = new Date().getMonth();
    const day = new Date().getDay();
    this.minDate = new Date(currentYear, Mont, -day);
    this.maxDate = new Date(currentYear, Mont, day + 15);
  }
  private initForm() {
    this.FormularioDatosReportes = new FormGroup({
      fechaPagare: new FormControl(null, Validators.required),
      diasInicio: new FormControl(null),
      fechaPrimerPago: new FormControl(null, Validators.required),
      creditoMaximo: new FormControl(null),
      entidadFinanciera: new FormControl(null),
      tipoCuenta: new FormControl(null),
      numeroCuenta: new FormControl(null)
    });
  }
  openLg(content) {
    this.getDocumentosCredito();
    this.modalService.open(content);
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, { windowClass: 'custom-width-variant-modal' });
  }
  getTipoReportes() {
    this.generacionDocs.getReportesDisponibles(this.mensajeServicio.NumeroCredito, this.mensajeServicio.idProducto, this.mensajeServicio.idSucursal).subscribe(
      (data: any) => {
        this.tipoReportes = data.CREDITO;
        // console.log(this.tipoReportes);
      }, (errorServicio) => {
        // console.log('Error');
      }
    );
  }

  getEstadoGenerarDocumentacion() {
    this.generacionDocs.getEstadoGenerarDocumentacion(this.mensajeServicio.NumeroCredito).subscribe(
      (data: any) => {
        this.estadoGeneracion = data;
        // console.log(this.tipoReportes);
      }, (errorServicio) => {
        // console.log('Error');
      }
    );
  }

  getEntidadFinanciera() {
    this.documentosService.getEntidadFinanciera()
      .pipe(map(data => data["ENTI_FINA"]))
      .subscribe((data: any) => {
        this.EntidadFinanciera = data;
        // console.log(this.EntidadFinanciera);
      });
  }

  // generarDocumentos(content, contentError,fechaPagare,fechaPrimerPago) {

  generarDocumentos(content, contentError) {
    // let SplitfechaPagare = fechaPagare.split("/");
    // let SplitfechaPrimerPago = fechaPrimerPago.split("/");
    // let string1 = SplitfechaPagare[1]+"/"+SplitfechaPagare[0]+"/"+SplitfechaPagare[2] + ' 00:00:00';
    // let string2 = SplitfechaPrimerPago[1]+"/"+SplitfechaPrimerPago[0]+"/"+SplitfechaPrimerPago[2] + ' 00:00:00';
    // let FechaPagareCalculada: Date = new Date(string1);
    // let FechaPrimerPagoCalculada: Date = new Date(string2);
    // if (!this.puedeCambiarFechas) {
    //   if (FechaPagareCalculada >= this.FechaPagareMin && FechaPagareCalculada <= this.FechaPagareMax) {
    //     // Fecha Correcta
    //   } else {
    //     // fecha Incorrecta
    //     this.errorMessage = 'Fecha de pagaré fuera del rango permitido';
    //     this.modalService.open(contentError, {windowClass: 'custom-width-error-modal'});
    //     return;
    //   }
    //   if (FechaPrimerPagoCalculada >= this.FechaPrimerPagoMin && FechaPrimerPagoCalculada <= this.FechaPrimerPagoMax) {
    //     // Fecha Correcta
    //   } else {
    //     // fecha Incorrecta
    //     this.errorMessage = 'Fecha Primer pago fuera del rango permitido';
    //     this.modalService.open(contentError, {windowClass: 'custom-width-error-modal'});
    //     return;
    //   }
    // }
    // this.loading = true;
    // const variable = new GeneracionDocumentos();
    // const arregloReportesEnviar = new Array<ReporteWebserviceUx>();
    // this.tipoReportes.forEach(element => {
    //   if (element.selected) {
    //     arregloReportesEnviar.push(element);
    //   }
    // });
    // variable.reportesImprimir = arregloReportesEnviar;
    // variable.ID_CRE = this.mensajeServicio.NumeroCredito;
    // variable.fechaPagare = fechaPagare;
    // variable.fechaPrimerPago =  fechaPrimerPago;
    // variable.entidadFinanciera = this.FormularioDatosReportes.controls['entidadFinanciera'].value;
    // variable.TipoDeCuenta = this.FormularioDatosReportes.controls['tipoCuenta'].value;
    // variable.NumeroCuentaBancaria = this.FormularioDatosReportes.controls['numeroCuenta'].value;
    // variable.lblCuentasMupi = this.mensajeServicio.CuentasMupi;
    // variable.usuario = localStorage.getItem('usuario');
    // variable.ID_CLI = this.mensajeServicio.Cedula;
    // variable.UsaFirmaElectronica = this.mensajeServicio.UsaFirmaElectronica;
    // // console.log(variable);
    let string1 = this.mesIngresado + "/" + this.diaIngresado + "/" + this.yearIngresado + ' 00:00:00';
    //let string1 = this.FormularioDatosReportes.controls['fechaPagare'].value.toString().substring(0, 10) + ' 00:00:00';
    let string2 = this.mesIngresado2 + "/" + this.diaIngresado2 + "/" + this.yearIngresado2 + ' 00:00:00';
    let FechaPagareCalculada: Date = new Date(string1);
    let FechaPrimerPagoCalculada: Date = new Date(string2);
    if (!this.puedeCambiarFechas) {
      if (FechaPagareCalculada >= this.FechaPagareMin && FechaPagareCalculada <= this.FechaPagareMax) {
        // Fecha Correcta
      } else {
        // fecha Incorrecta
        this.errorMessage = 'Fecha de pagaré fuera del rango permitido';
        this.modalService.open(contentError, { windowClass: 'custom-width-error-modal' });
        return;
      }
      if (FechaPrimerPagoCalculada >= this.FechaPrimerPagoMin && FechaPrimerPagoCalculada <= this.FechaPrimerPagoMax) {
        // Fecha Correcta
      } else {
        // fecha Incorrecta
        this.errorMessage = 'Fecha Primer pago fuera del rango permitido';
        this.modalService.open(contentError, { windowClass: 'custom-width-error-modal' });
        return;
      }
    }
    this.loading = true;
    const variable = new GeneracionDocumentos();
    const arregloReportesEnviar = new Array<ReporteWebserviceUx>();
    this.tipoReportes.forEach(element => {
      if (element.selected) {
        arregloReportesEnviar.push(element);
      }
    });
    variable.reportesImprimir = arregloReportesEnviar;
    variable.ID_CRE = this.mensajeServicio.NumeroCredito;
    variable.fechaPagare = this.FormularioDatosReportes.controls['fechaPagare'].value;
    variable.fechaPrimerPago = this.FormularioDatosReportes.controls['fechaPrimerPago'].value;
    variable.entidadFinanciera = this.FormularioDatosReportes.controls['entidadFinanciera'].value;
    variable.TipoDeCuenta = this.FormularioDatosReportes.controls['tipoCuenta'].value;
    variable.NumeroCuentaBancaria = this.FormularioDatosReportes.controls['numeroCuenta'].value;
    variable.lblCuentasMupi = this.mensajeServicio.CuentasMupi;
    variable.usuario = localStorage.getItem('usuario');
    variable.ID_CLI = this.mensajeServicio.Cedula;
    variable.UsaFirmaElectronica = this.mensajeServicio.UsaFirmaElectronica;
    // console.log(variable);

    this.generacionDocs.postGeneracionDocumentos(variable).subscribe(
      (data: any) => {
        let resultado = data;
        if (resultado.resultado === 'Archivo Generado!') {
          if (variable.TipoDeCuenta === '' && variable.NumeroCuentaBancaria === '' && variable.entidadFinanciera === '') {
            this.FormularioDatosReportes.controls['entidadFinanciera'].setValue(resultado.entidadFinanciera);
            this.FormularioDatosReportes.controls['tipoCuenta'].setValue(resultado.TipoDeCuenta);
            this.FormularioDatosReportes.controls['numeroCuenta'].setValue(resultado.NumeroCuentaBancaria);
          }
          this.urlArchivoGenerado = data.urlArchivoGenerado;
          // console.log(data);
          this.loading = false;
          this.getTipoReportes();
          this.estadoGeneracion = resultado.GenerarDocumentos;
          if (resultado.GenerarDocumentos.Respuesta.toLowerCase() !== 'ok') {
            if (resultado.GenerarDocumentos.Mensaje !== 'Solicitud enviada fuera de horario de procesamiento') {
              this.router.navigate(['/fabrica/consulta-general']);
              this.errorMessage = 'Existen problemas de conexión, por favor inténtelo más tarde';
            } else {
              this.errorMessage = resultado.GenerarDocumentos.Mensaje;
            }
            this.loading = false;
            this.estadoGeneracion = true;
            this.getEstadoGenerarDocumentacion();
            this.modalService.open(contentError, { windowClass: 'custom-width-error-modal' });
          } else {
            this.modalService.open(content, { windowClass: 'custom-width-variant-modal' });
            this.estadoGeneracion = false;
          }
        } else {
          this.errorMessage = resultado.resultado;
          this.loading = false;
          this.modalService.open(contentError, { windowClass: 'custom-width-error-modal' });
        }
      });
  }
  getTipoCuenta(): any {
    // if (this.NOMBRE_BANCO !== null || this.NOMBRE_BANCO !== undefined ) {
    this.documentosService.getTipoCuenta()
      .pipe(map(data => data["TIPO_CUENTA_BANCARIA"]))
      .subscribe((data: any) => {
        this.TipoCuenta = data;
        // console.log(this.TipoCuenta);
      });
    // }
  }
  inicializarDatosCuentas() {
    // console.log(this.mensajeServicio.CuentasMupi);
    if (this.mensajeServicio.CuentasMupi === 'True') {
      // debe poner true para deshabilitar el control
      this.numeroCuentaEnabled = true;
      this.entidadFinancieraEnabled = true;
      this.tipoCuentaEnabled = true;
    } else {
      // no debe deshabilitar el control
      this.numeroCuentaEnabled = true;
      this.entidadFinancieraEnabled = true;
      this.tipoCuentaEnabled = true;
    }
    try {
      if (this.mensajeServicio.FECHA_INICIO_CREDITO_REAL_CRE !== '' && this.mensajeServicio.FCH_PAGARE_SOL !== '') {
        this.puedeCambiarFechas = true;
        // console.log('Cambio a no editable ' + this.puedeCambiarFechas);
      } else {
        // console.log('Si se puede editar ' + this.puedeCambiarFechas);
      }
      this.FechaPagareMin = new Date(this.mensajeServicio.FechaPagareMin);
      this.FechaPagareMax = new Date(this.mensajeServicio.FechaPagareMax);
    } catch { }
    let FCH_PAGARE_SOL: Date;
    let FECHA_INICIO_CREDITO_REAL_CRE: Date;
    let fechaPagareTexto = '';
    let fechaInicioCreditoTexto = '';
    try {
      FCH_PAGARE_SOL = new Date(this.mensajeServicio.FCH_PAGARE_SOL);
      fechaPagareTexto = FCH_PAGARE_SOL.toISOString().substring(0, 10);
      this.FechaPrimerPagoMin = new Date(this.addDays(FCH_PAGARE_SOL, +Number(this.mensajeServicio.DiasInicioCredito)));
      this.FechaPrimerPagoMax = new Date(this.addDays(FCH_PAGARE_SOL, +Number(this.mensajeServicio.DiasInicioMaximoCredito) - Number(this.mensajeServicio.DiasInicioCredito)));
    } catch {
    }
    try {
      FECHA_INICIO_CREDITO_REAL_CRE = new Date(this.mensajeServicio.FECHA_INICIO_CREDITO_REAL_CRE);
      fechaInicioCreditoTexto = FECHA_INICIO_CREDITO_REAL_CRE.toISOString().substring(0, 10);
    } catch { }
    // console.log('Iniciarliza formulario con ' + fechaPagareTexto +' ' + fechaInicioCreditoTexto);
    this.FormularioDatosReportes = new FormGroup({
      fechaPagare: new FormControl({
        value: fechaPagareTexto,
        disabled: this.puedeCambiarFechas
      }, Validators.required),
      diasInicio: new FormControl(this.mensajeServicio.DiasInicioCredito),
      fechaPrimerPago: new FormControl({
        value: fechaInicioCreditoTexto,
        disabled: this.puedeCambiarFechas
      }, Validators.required),
      creditoMaximo: new FormControl(this.mensajeServicio.DiasInicioMaximoCredito),
      entidadFinanciera: new FormControl({
        value: this.mensajeServicio.Banco,
        disabled: this.entidadFinancieraEnabled
      }),
      tipoCuenta: new FormControl({
        value: this.mensajeServicio.TipoDeCuentaBancaria,
        disabled: this.tipoCuentaEnabled
      }),
      numeroCuenta: new FormControl({
        value: this.mensajeServicio.CuentaBanco,
        disabled: this.numeroCuentaEnabled
      })
    });

  }
  addDays(date: Date, days: number): Date {
    if (date !== undefined) {
      let aux = new Date(date);
      var dias = days;
      aux.setDate(date.getDate() + dias);
      return aux;
    } else {
      return null;
    }
  }
  openCustomWidthVariantCancelar(content) {
    this.modalService.open(content, { windowClass: 'custom-width-variant-modal' });
  }
  generarCancelacion(motivo: string) {
    this.modalService.dismissAll();
    this.fabricaService.getCancelarSolicitud(this.mensajeServicio.NumeroCredito,
      localStorage.getItem('usuario'), motivo).subscribe(
        data => {
          if (data.toString() === 'Solicitud Cancelada exitosamente!') {
            this.mensajeServicio.Estado = 'Cancelada';
            this.successMessage = data.toString();
          }
        });
    setTimeout(() => {
    }, 2500);
    this.router.navigate(['/fabrica/consulta-general']);
  }
  cambioFechaPagare(event: any) {
    let fechaAct: Date = new Date();
    if (event == null) {
      fechaAct = this.FechaActual;
    } else {
      fechaAct = event.target.value;
      this.insertarFecha(fechaAct, 1)
      this.FechaActual=fechaAct;
    }
    let FechaPagareCalculada: Date;
    if (fechaAct.toString().indexOf('GMT') >= 0) {
      FechaPagareCalculada = fechaAct;
    }
    //else {
    //   if(fechaAct.length >= 8) {
    //   FechaPagareCalculada = new Date(fechaAct + ' 00:00:00');
    //   }else{
    //     return;
    //   }
    // }
    try {
      //this.FormularioDatosReportes.controls['fechaPagare'].value.setValue(FechaPagareCalculada.getDate()+"/"+FechaPagareCalculada.getMonth()+"/"+FechaPagareCalculada.getFullYear());
      // let FechaPagareCalculada: Date = new Date(fechaPagare.substring(0, 10) + ' 00:00:00');
      // let FechaPagareCalculada: Date = fechaPagare;
      // alert(FechaPagareCalculada);              
      this.FechaPrimerPagoMin = new Date(this.addDays(FechaPagareCalculada, +Number(this.FormularioDatosReportes.controls['diasInicio'].value)));
      const diferencia = +Number(this.FormularioDatosReportes.controls['creditoMaximo'].value) - Number(this.FormularioDatosReportes.controls['diasInicio'].value);
      // console.log("FechaPrimerPagoMin:"+this.FechaPrimerPagoMin.toString());
      // console.log("Diferencia:"+diferencia.toString());
      this.FechaPrimerPagoMax = new Date(this.addDays(this.FechaPrimerPagoMin, diferencia));
      // console.log("FechaPrimerPagoMax:"+this.FechaPrimerPagoMax.toString());
    } catch { }
  }
  insertarFecha(fecha: Date, ref) {
    //Usa la fecha ingresada en el datepicker para ser mostradas en los inputs
    //de dia, mes y año en la vista de Generacion pagaré
    if (ref == 1) {
      this.diaIngresado = this.agregarCero(fecha.getDate().toString());
      this.mesIngresado = this.agregarCero((fecha.getMonth() + 1).toString());
      this.yearIngresado = fecha.getFullYear().toString();
    }else if (ref == 2) {
      this.diaIngresado2 = this.agregarCero(fecha.getDate().toString());
      this.mesIngresado2 = this.agregarCero((fecha.getMonth() + 1).toString());
      this.yearIngresado2 = fecha.getFullYear().toString();

    }

  }
  convertirFecha(ref) {
    let fechaCon = new Date();
    try {
      if(ref==1){
        fechaCon.setMonth(Number(this.mesIngresado) - 1);
      fechaCon.setDate(Number(this.diaIngresado));
      fechaCon.setFullYear(Number(this.yearIngresado));
      this.FechaActual = fechaCon;

      }else if(ref==2){
        fechaCon.setMonth(Number(this.mesIngresado2) - 1);
      fechaCon.setDate(Number(this.diaIngresado2));
      fechaCon.setFullYear(Number(this.yearIngresado2));
      this.FechaActual2 = fechaCon;

      }
      
    } catch {
      alert("Faltan datos")
    }
  }
  limpiarCampo(event: any) {
    if (event.target.value != '') {
      this.temporal = event.target.value;
    }
    event.target.value = '';
  }
  agregarCero(dato) {
    let aumentar = dato;
    if (dato < 10 && dato.length == 1) {
      aumentar = "0" + aumentar;
    }
    return aumentar;
  }

  autocompletarCampo(event: any, ref, ref2) {
    if (event.target.value == '') {
      if(ref2==1){
        if (this.temporal.length == 4 && ref == null) {
          this.yearIngresado = this.temporal;
          if (this.FechaActual != null) {
            this.convertirFecha(1);
            this.cambioFechaPagare(null);
            let cambio = this.FechaActual.getDate() + "/" + (this.FechaActual.getMonth() + 1) + "/" + this.FechaActual.getFullYear();
            this.FechaCambio = cambio;
          }
        }        
      }
      if(ref2==2){
        if (this.temporal.length == 4 && ref == null) {
          this.yearIngresado2 = this.temporal;
          if (this.FechaActual2 != null) {
            this.convertirFecha(2);
            let cambio = this.FechaActual2.getDate() + "/" + (this.FechaActual2.getMonth() + 1) + "/" + this.FechaActual2.getFullYear();
            this.FechaCambio2 = cambio;
          }
        }        
      }
      
      event.target.value = this.temporal;
      this.temporal='';
      
    } else {
      if(ref2==1){
        if (this.validarCapo(event.target.value, ref)) {
          if (ref == 'dia') {
            this.diaIngresado = (this.agregarCero(event.target.value));
          }
          if (ref == 'mes') {
            this.mesIngresado = (this.agregarCero(event.target.value));
          }
          if (ref == null) {
            this.FechaActual=event.target.value;
          }
        }
        if(this.FechaActual != null){
          this.convertirFecha(1);
            this.cambioFechaPagare(null);
            let cambio = this.FechaActual.getDate() + "/" + (this.FechaActual.getMonth() + 1) + "/" + this.FechaActual.getFullYear();
            this.FechaCambio = cambio;        
        }

      }else if(ref2==2){
        if (this.validarCapo(event.target.value, ref)) {
          if (ref == 'dia') {
            this.diaIngresado2 = (this.agregarCero(event.target.value));
          }
          if (ref == 'mes') {
            this.mesIngresado2 = (this.agregarCero(event.target.value));
          }
          if (ref == null) {
            this.FechaActual2=event.target.value;
          }
        }

        if (this.FechaActual2 != null) {
          this.convertirFecha(2);
          let cambio = this.FechaActual2.getDate() + "/" + (this.FechaActual2.getMonth() + 1) + "/" + this.FechaActual2.getFullYear();
          this.FechaCambio2 = cambio;
        }
      }
      
      this.temporal='';

      
    }

  }
  validarCapo(value, ref) {
    let numero: Number;
    try {
      if (ref == 'dia') {
        numero = Number(value);
        if (numero >= 0 && numero <= 31) {
          return true;
        } else {
          return false;
        }
      } else if (ref == 'mes') {
        numero = Number(value);
        if (numero >= 0 && numero <= 12) {
          return true;
        } else {
          return false;
        }
      } else {
        numero = Number(value);
        if (numero > 0) {
          return true

        } else {
          return false
        }
      }
    } catch {
      return false;
    }

  }
  automaticTab(event: any, ref, ref2) {
    if (this.validarCapo(event.target.value, ref) && event.key != "Tab") {
      let element;
      var aux = false;
      let largo = event.target.value.length;
      if(ref2==1){
        if (event.key == "Backspace" || event.key == "Tab") {
          aux = true;
        } else {
          aux = false
        }
        if (event.key == "Tab") {
          if (event.target.previousElementSibling.value !== null && ref == 'mes') {
            this.diaIngresado = (event.target.previousElementSibling.value);
          } else if (ref == null) {
            this.mesIngresado = (event.target.previousElementSibling.value);
          }
        }
        if (!aux) {
          if (largo == 4) {
            if(this.diaIngresado!=null&&this.mesIngresado!=null){
              this.primerIngreso=true
            }
            this.yearIngresado = (event.target.value);
            element = event.srcElement.parentNode.nextSibling;
            let aux = element.parentNode;
            element = aux.nextSibling;
            aux = element.nextSibling.firstChild;
            element = aux.nextElementSibling;
            aux= element.firstChild;
            element=aux;
            console.log(aux);
            this.convertirFecha(1);
            this.cambioFechaPagare(null);
            let cambio = this.FechaActual.getDate() + "/" + (this.FechaActual.getMonth() + 1) + "/" + this.FechaActual.getFullYear();
            this.FechaCambio = cambio;
          } else if (largo == 2) {
            if (ref == 'dia') {
              this.diaIngresado= (event.target.value);
            } else if (ref == 'mes') {
              this.mesIngresado= (event.target.value);
            }
            element = event.srcElement.nextElementSibling;
          }          
        }         

      }
      if(ref2==2){
        if (event.key == "Backspace" || event.key == "Tab") {
          aux = true;
        } else {
          aux = false
        }
        if (event.key == "Tab") {
          if (event.target.previousElementSibling.value !== null && ref == 'mes') {
            this.diaIngresado2 = (event.target.previousElementSibling.value);
          } else if (ref == null) {
            this.mesIngresado2 = (event.target.previousElementSibling.value);
          }
        }
        if(!aux){
          if (largo == 4) {
            this.yearIngresado2 = (event.target.value);
            event.srcElement.blur();
            this.convertirFecha(2);
            let cambio = this.FechaActual2.getDate() + "/" + (this.FechaActual2.getMonth() + 1) + "/" + this.FechaActual2.getFullYear();
            this.FechaCambio2 = cambio;
          } else if (largo == 2) {
            if (ref == 'dia') {
              this.diaIngresado2= (event.target.value);
            } else if (ref == 'mes') {
              this.mesIngresado2 = (event.target.value);
            }
            element = event.srcElement.nextElementSibling;
          }
        }        
          
      }   
      if (element == null) {
        return;
      }
      else {
        element.focus();
      }

    } else {
      event.target.value = null;
      return;
    }

  }
  agregarCaracter(event: any) {
    var campo = event.target.value
    var aux = false;
    if (event.key == "Backspace") {
      aux = true;
    } else {
      aux = false
    }
    if (!aux) {
      if (campo.length == 2 || campo.length == 5) {
        campo = campo + "/"
      };
      event.target.value = campo;
    }
  }
  incializarCredito() {
    this.fabricaService.getRetomarCredito(this.mensajeServicio.NumeroCredito,
      localStorage.getItem('usuario')).pipe(map(data => data['Table1'][0])).subscribe(
        (data: DatosFabrica) => {
          // console.log(data);
          this.acoplarPantalla(this.mensajeServicio.Estado);
          this.getTipoReportes();
          this.getEntidadFinanciera();
          this.getTipoCuenta();
          this.inicializarDatosCuentas();
        });
  }
  acoplarPantalla(lblEstadoSolicitud: string) {
    if (lblEstadoSolicitud === undefined) {
      return;
    }
    if (lblEstadoSolicitud === 'Documental' || lblEstadoSolicitud === 'Cancelada' ||
      lblEstadoSolicitud === 'Aprobada' || lblEstadoSolicitud === 'Autorizada' ||
      lblEstadoSolicitud === 'Re-Documental' || lblEstadoSolicitud === 'RechazadaCC' ||
      lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Caducada' ||
      lblEstadoSolicitud === 'Perfil No Aprobado' || lblEstadoSolicitud === 'Retornada' ||
      lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'Rechazada' ||
      lblEstadoSolicitud === 'Autorización Caducada' || lblEstadoSolicitud === 'Consultada' ||
      lblEstadoSolicitud === 'Ingresando' || lblEstadoSolicitud === 'Verificando' || lblEstadoSolicitud === 'Devuelta' ||
      lblEstadoSolicitud === 'Re-verificación' || lblEstadoSolicitud === 'Guardada') {
      // pageControlCliente.TabPages[7].Enabled = true;
      if (lblEstadoSolicitud === 'Aprobada') {
        // console.log('Bloqueado 1' + lblEstadoSolicitud);
        this.btnSolicitarAnulacion = false;
        this.SubirArchivos = false;
        this.generarDocumentacion = true;
      } else {
        if (lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Rechazada' ||
          lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'RechazadaCC' ||
          lblEstadoSolicitud === 'Caducada' || lblEstadoSolicitud === 'Autorización Caducada') {
          // this.pestaniasIngreso.controls['selectTabs'].setValue('Políticas');
          // ('Bloqueado 2' + lblEstadoSolicitud);
          this.btnSolicitarAnulacion = false;
          this.SubirArchivos = false;
          this.generarDocumentacion = false;
          // ASPxUploadControl1.Visible = false;
          // ASPxUploadControl2.Visible = false;
          // ASPxUploadControl3.Visible = false;
          // btnGenerarReportesDinamicos.Visible = false;
          // btnRefrescar.Visible = false;
          // BtnGuardar.Visible = false;
        } else {
          if (lblEstadoSolicitud === 'Cancelada' || lblEstadoSolicitud === 'Consultada') {
            // console.log('Bloqueado 3' + lblEstadoSolicitud);
            this.btnSolicitarAnulacion = false;
            this.SubirArchivos = false;
            this.generarDocumentacion = false;
          }
        }
      }
    } else {
      // console.log('Bloqueado 5' + lblEstadoSolicitud);
      this.btnSolicitarAnulacion = false;
      this.SubirArchivos = false;
      this.generarDocumentacion = false;
    }
  }
  getDocumentosCredito() {
    this.documentosService.getDocumentosSubidos(this.mensajeServicio.NumeroCredito)
      .pipe(map(data => data["DOCUMENTOS"]))
      .subscribe((data: any) => {
        this.documentosSubidos = data;
        // console.log(this.documentosSubidos);
      });
  }
  fileChange(event, contentE, contentA) {
    this.archivoSeleccionado = <File>event.target.files[0];
    this.Archivos.push(this.archivoSeleccionado);
    this.loading = true;
    if (this.Archivos.length > 0) {
      //console.log(fileList);
      this.documentosService.postFileImagen(this.Archivos, this.mensajeServicio.NumeroCredito,
        localStorage.getItem('usuario'))
        .subscribe(
          (data: any) => {
            if (data.listaResultado.length > 0) {
              this.loading = false;
              this.successMessage = 'Archivo cargado';
            }
            if (data.listaErrores.length > 0) {
              let mensajeError = '';
              for (const mensaje of data.listaErrores) {
                mensajeError += mensaje + '\n';
              }
              this.loading = false;
              this.errorMessage = mensajeError;
              this.modalService.open(contentE, { windowClass: 'custom-width-error-modal' });
            }
            if (data.listaAdvertencias.length > 0) {
              let mensajeAdvertencia = '';
              for (const mensaje of data.listaAdvertencias) {
                mensajeAdvertencia += mensaje + '\n';
              }
              this.loading = false;
              this.advertenceMessage = mensajeAdvertencia;
              this.modalService.open(contentA, { windowClass: 'custom-width-error-modal' });
            }
            // @ts-ignore
            this.documentosSubidos = this.getDocumentosCredito();
          }
        );
    }
  }
}

