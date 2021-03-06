import { Component, Input, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DocumentosService } from '../../services/documentos.service';
import {map} from 'rxjs/operators';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { GeneracionDocumentos, GeneraDocService, ReporteWebserviceUx } from '../../services/generaDoc/genera-doc.service';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';
import {SituacionFinancieraService} from "../../services/situacionFinanciera/situacion-financiera.service";

@Component({
  selector: 'app-content-fabrica-resumen',
  templateUrl: './content-fabrica-resumen.component.html',
  styleUrls: ['./content-fabrica-resumen.component.css']
})
export class ContentFabricaResumenComponent implements OnInit {
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
  puedeCambiarFechas: boolean = false;
  Archivos: File[] = [];
  archivoSeleccionado: File = null;
  formaResumen: FormGroup;
  @Input() idCre: string;
  idCredito: string;
  // bkm
  minDate: Date;
  maxDate: Date;
  resumenes: any;
  constructor(private modalService: NgbModal,
              private documentosService: DocumentosService,
              private fabricaService: FabricaService,
              private fb: FormBuilder,
              private generacionDocs: GeneraDocService,
              private situacionFinancieraService: SituacionFinancieraService,
              private router: Router) {
                
          }

  ngOnInit() {
    this.initForm();
    if (this.idCre !== undefined && this.idCre !== '') {
      this.idCredito = this.idCre;
      // console.log('Solicitud de credito:' + this.idCredito);
      if(this.idCredito!== 'undefined' && this.idCredito!== 'undefined' && this.idCredito!== '') {
      if (typeof this.idCredito !== 'undefined' && this.mensajeServicio=== undefined) {
            this.fabricaService.getRetomarCredito(this.idCredito,
              localStorage.getItem('usuario')).pipe(map (data => data['Table1'][0])).subscribe(
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
          this.acoplarPantalla(this.mensajeServicio.Estado);
          this.getTipoReportes();
          this.crearFormularioResumen();
          this.getResumenes();
          
          // console.log(this.mensajeServicio);
        });
      }
    
  }
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
  public getResumenes(): any {
    this.situacionFinancieraService.getResumen(this.mensajeServicio.NumeroCredito)
      .pipe(map(data => data['RESUMEN']))
      .subscribe((data: any) => {
        this.resumenes = data[0];
        this.cargarFormularioResumen();
        // console.log(this.resumenes);
      });
  }
  cargarFormularioResumen() {
    this.formaResumen.reset({
      Entrada: this.resumenes.ENTRADA_CRE,
      Venta_Proforma_Total: this.resumenes.VENTA_PROFORMA_TOTAL,
      Servicio_Gesti??n_Cr??dito_Documental_sinIva: this.resumenes.ValorSinIva,
      Iva_servicios: this.resumenes.Iva,
      //Servicio_Gesti??n_Cr??dito: this.resumenes.ValorPorGestionCredito,
      //Servicio_Gesti??n_Documental: this.resumenes.ValorServicioDocumental,
      Valor_Total_Factura: this.resumenes.VENTA_TOTAL_CRE,
      Monto_Cr??dito: this.resumenes.VALOR_DESEM_CRE,
      Plazo: this.resumenes.PLAZO_DEUDA_CRE,
      Cuota_Mensual_Estimada: this.resumenes.CUOTA_FIJA_SOL,
      Cuota_Mensual_Pagar??: this.resumenes.CUOTA_MENSUAL_REAL,
      Cuota_Mensual_Seguro: this.resumenes.VALOR_CUOTA_CUO
    });
  }
  crearFormularioResumen() {
    this.formaResumen = this.fb.group({
      Entrada: [''],
      Venta_Proforma_Total: [''],
      //Servicio_Gesti??n_Cr??dito: [''],
      //Servicio_Gesti??n_Documental: [''],
      Servicio_Gesti??n_Cr??dito_Documental_sinIva: [''],
      Iva_servicios: [''],
      Valor_Total_Factura: [''],
      Monto_Cr??dito: [''],
      Plazo: [''],
      Cuota_Mensual_Estimada: [''],
      Cuota_Mensual_Pagar??: [''],
      Cuota_Mensual_Seguro: ['']
    });
  }
  openLg(content) {
    this.getDocumentosCredito();
    this.modalService.open(content);
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }
  getTipoReportes() {
    this.generacionDocs.getReportesDisponibles(this.mensajeServicio.NumeroCredito, '', '').subscribe(
      (data: any) => {
        this.tipoReportes = data.CREDITO;
        // console.log(this.tipoReportes);
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
  getEntidadFinanciera() {
    this.documentosService.getEntidadFinanciera()
      .pipe(map (data => data["ENTI_FINA"]))
      .subscribe((data: any) => {
        this.EntidadFinanciera = data;
        // console.log(this.EntidadFinanciera);
      });
  }

  generarDocumentos(content, contentError) {
    let string1 = this.FormularioDatosReportes.controls['fechaPagare'].value.substring(0, 10) + ' 00:00:00';
    let string2 = this.FormularioDatosReportes.controls['fechaPrimerPago'].value.substring(0, 10) + ' 00:00:00';
    let FechaPagareCalculada: Date = new Date(string1);
    let FechaPrimerPagoCalculada: Date = new Date(string2);
    if (FechaPagareCalculada >= this.FechaPagareMin && FechaPagareCalculada <= this.FechaPagareMax) {
      // Fecha Correcta

    } else {
      // fecha Incorrecta
      this.errorMessage = 'Fecha de pagar?? fuera del rango permitido';
      this.modalService.open(contentError, {windowClass: 'custom-width-error-modal'});
      return;
    }
    if (FechaPrimerPagoCalculada >= this.FechaPrimerPagoMin && FechaPrimerPagoCalculada <= this.FechaPrimerPagoMax) {
      // Fecha Correcta
    } else {
      // fecha Incorrecta
      this.errorMessage = 'Fecha Primer pago fuera del rango permitido';
      this.modalService.open(contentError, {windowClass: 'custom-width-error-modal'});
      return;
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
    variable.fechaPrimerPago =  this.FormularioDatosReportes.controls['fechaPrimerPago'].value;
    variable.entidadFinanciera = this.FormularioDatosReportes.controls['entidadFinanciera'].value;
    variable.TipoDeCuenta = this.FormularioDatosReportes.controls['tipoCuenta'].value;
    variable.NumeroCuentaBancaria = this.FormularioDatosReportes.controls['numeroCuenta'].value;
    variable.lblCuentasMupi = this.mensajeServicio.CuentasMupi;
    variable.usuario = localStorage.getItem('usuario');
    variable.ID_CLI = this.mensajeServicio.Cedula;
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
          this.loading = false;
          this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
        } else {
          this.errorMessage = resultado.resultado;
          this.loading = false;
          this.modalService.open(contentError, {windowClass: 'custom-width-error-modal'});
        }
      });
  }
  getTipoCuenta(): any {
    // if (this.NOMBRE_BANCO !== null || this.NOMBRE_BANCO !== undefined ) {
    this.documentosService.getTipoCuenta()
      .pipe(map (data => data["TIPO_CUENTA_BANCARIA"]))
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
    } catch {}
    let FCH_PAGARE_SOL: Date;
    let FECHA_INICIO_CREDITO_REAL_CRE: Date;
    let fechaPagareTexto = '';
    let fechaInicioCreditoTexto = '';
    try {
      FCH_PAGARE_SOL = new Date(this.mensajeServicio.FCH_PAGARE_SOL);
      fechaPagareTexto = FCH_PAGARE_SOL.toISOString().substring(0, 10);
      this.FechaPrimerPagoMin = new Date(this.addDays(FCH_PAGARE_SOL, Number(this.mensajeServicio.DiasInicioCredito)));
      this.FechaPrimerPagoMax = new Date(this.addDays(FCH_PAGARE_SOL, +Number(this.mensajeServicio.DiasInicioMaximoCredito)-Number(this.mensajeServicio.DiasInicioCredito)));
    } catch {
    }
    try {
      FECHA_INICIO_CREDITO_REAL_CRE = new Date(this.mensajeServicio.FECHA_INICIO_CREDITO_REAL_CRE);
      fechaInicioCreditoTexto = FECHA_INICIO_CREDITO_REAL_CRE.toISOString().substring(0, 10);
    } catch {}
    // console.log('Iniciarliza formulario con ' + fechaPagareTexto +' ' + fechaInicioCreditoTexto);
    this.FormularioDatosReportes = new FormGroup({
      fechaPagare: new FormControl({value: fechaPagareTexto,
        disabled: this.puedeCambiarFechas}, Validators.required),
      diasInicio: new FormControl(this.mensajeServicio.DiasInicioCredito),
      fechaPrimerPago: new FormControl({value: fechaInicioCreditoTexto,
        disabled: this.puedeCambiarFechas}, Validators.required),
      creditoMaximo: new FormControl(this.mensajeServicio.DiasInicioMaximoCredito),
      entidadFinanciera: new FormControl({value: this.mensajeServicio.Banco,
        disabled: this.entidadFinancieraEnabled}),
      tipoCuenta: new FormControl({value: this.mensajeServicio.TipoDeCuentaBancaria,
        disabled: this.tipoCuentaEnabled}),
      numeroCuenta: new FormControl({value: this.mensajeServicio.CuentaBanco,
        disabled: this.numeroCuentaEnabled})
    });

  }
  addDays(date: Date, days: number): Date {
    var dias = days;
    date.setDate(date.getDate() + dias);
    return date;
  }
  openCustomWidthVariantCancelar(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
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
    setTimeout (() => {
    }, 2500);
    this.router.navigate(['/fabrica/consulta-general']);
  }
  cambioFechaPagare(fechaPagare) {
    try {
      let FechaPagareCalculada: Date = new Date(fechaPagare);
      this.FechaPrimerPagoMin = new Date(this.addDays(FechaPagareCalculada,
        Number(this.FormularioDatosReportes.controls['diasInicio'].value)));
      this.FechaPrimerPagoMax = new Date(this.addDays(FechaPagareCalculada,
        +Number(this.FormularioDatosReportes.controls['creditoMaximo'].value)-Number(this.FormularioDatosReportes.controls['diasInicio'].value)));
    } catch {}
  }

  incializarCredito() {
    this.fabricaService.getRetomarCredito(this.mensajeServicio.NumeroCredito,
      localStorage.getItem('usuario')).pipe(map (data => data['Table1'][0])).subscribe(
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
      lblEstadoSolicitud === 'Autorizaci??n Caducada' || lblEstadoSolicitud === 'Consultada' ||
      lblEstadoSolicitud === 'Ingresando' || lblEstadoSolicitud === 'Verificando' || lblEstadoSolicitud === 'Devuelta' ||
      lblEstadoSolicitud === 'Re-verificaci??n' || lblEstadoSolicitud === 'Guardada') {
      // pageControlCliente.TabPages[7].Enabled = true;
      if (lblEstadoSolicitud === 'Aprobada') {
        // console.log('Bloqueado 1' + lblEstadoSolicitud);
        this.btnSolicitarAnulacion = false;
        this.SubirArchivos = false;
        this.generarDocumentacion = true;
      } else {
        if (lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Rechazada' ||
          lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'RechazadaCC' ||
          lblEstadoSolicitud === 'Caducada' || lblEstadoSolicitud === 'Autorizaci??n Caducada') {
          // this.pestaniasIngreso.controls['selectTabs'].setValue('Pol??ticas');
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
      .pipe(map (data => data["DOCUMENTOS"]))
      .subscribe((data: any) => {
        this.documentosSubidos = data;
        // console.log(this.documentosSubidos);
      });
  }
  fileChange(event, contentE, contentA) {
    this.archivoSeleccionado = <File> event.target.files[0];
    this.Archivos.push(this.archivoSeleccionado);
    this.loading = true;
    if(this.Archivos.length > 0) {
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
              this.modalService.open(contentE, {windowClass: 'custom-width-error-modal'});
            }
            if (data.listaAdvertencias.length > 0) {
              let mensajeAdvertencia = '';
              for (const mensaje of data.listaAdvertencias) {
                mensajeAdvertencia += mensaje + '\n';
              }
              this.loading = false;
              this.advertenceMessage = mensajeAdvertencia;
              this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
            }
            // @ts-ignore
            this.documentosSubidos = this.getDocumentosCredito();
          }
        );
    }
  }
}

