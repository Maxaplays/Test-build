import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DocumentosService } from '../../services/documentos.service';
import {map} from 'rxjs/operators';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { GeneracionDocumentos, GeneraDocService, ReporteWebserviceUx } from '../../services/generaDoc/genera-doc.service';

@Component({
  selector: 'app-content-fabrica-generacion',
  templateUrl: './content-fabrica-generacion.component.html',
  styleUrls: ['./content-fabrica-generacion.component.css']
})
export class ContentFabricaGeneracionComponent implements OnInit {

  NOMBRE_BANCO: string;
  TIPO_BANCO: string;
  closeResult: string;
  EntidadFinanciera: any[] = [];
  TipoCuenta: any[] = [];
  NumeroCuenta: any[] = [];
  loading: boolean;
  // bkm
  mensajeServicio: DatosFabrica;
  errorMessage: string;
  urlArchivoGenerado: string;
  tipoReportes: ReporteWebserviceUx[];
  arregloReportes = new Array<ReporteWebserviceUx>();
  FormularioDatosReportes: FormGroup;
  numeroCuentaEnabled = false;
  entidadFinancieraEnabled = false;
  tipoCuentaEnabled = false;
  FechaPagareMax: Date;
  FechaPagareMin: Date;
  FechaPrimerPagoMax: Date;
  FechaPrimerPagoMin: Date;
  // bkm
  minDate: Date;
  maxDate: Date;
  constructor(private modalService: NgbModal,
              private documentosService: DocumentosService,
              private fabricaService: FabricaService,
              private generacionDocs: GeneraDocService) {
                this.fabricaService.currentMessage.subscribe(
                  data => {
                    this.mensajeServicio = data;
                    this.getTipoReportes();
                    // console.log(data);
                  });
  }

  ngOnInit() {
    this.initForm();
    this.inicializarDatosCuentas();
    this.getEntidadFinanciera();
    this.getTipoCuenta();
    const currentYear = new  Date () .getFullYear ();
    const Mont = new  Date () .getMonth();
    const day = new  Date ().getDay();
    this .minDate = new  Date (currentYear , Mont , -day);
    this .maxDate = new  Date (currentYear , Mont , day + 15 );
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
    this.modalService.open(content);
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }
  getTipoReportes() {
    this.generacionDocs.getReportesDisponibles(this.mensajeServicio.NumeroCredito).subscribe(
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

  generarDocumentos(content) {
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
    console.log(variable);
    this.generacionDocs.postGeneracionDocumentos(variable).subscribe(
      (data: any) => {
        let resultado = data;
        if (resultado.resultado === 'Archivo Generado!') {
          this.urlArchivoGenerado = data.urlArchivoGenerado;
          this.loading = false;
          this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
        } else {
          this.errorMessage = resultado.resultado;
          this.loading = false;
          this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
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
    console.log(this.mensajeServicio.CuentasMupi);
    this.FormularioDatosReportes.controls['entidadFinanciera'].setValue(this.mensajeServicio.Banco);
    this.FormularioDatosReportes.controls['tipoCuenta'].setValue(this.mensajeServicio.TipoDeCuentaBancaria);
    this.FormularioDatosReportes.controls['numeroCuenta'].setValue(this.mensajeServicio.CuentaBanco);
    this.FormularioDatosReportes.controls['diasInicio'].setValue(this.mensajeServicio.DiasInicioCredito);
    this.FormularioDatosReportes.controls['creditoMaximo'].setValue(this.mensajeServicio.DiasInicioMaximoCredito);
    try{
      let FCH_PAGARE_SOL: Date = new Date(this.mensajeServicio.FCH_PAGARE_SOL);
      this.FormularioDatosReportes.controls['fechaPagare'].setValue(FCH_PAGARE_SOL.toISOString().substring(0, 10));
      this.FechaPrimerPagoMin = new Date(this.addDays(FCH_PAGARE_SOL, Number(this.mensajeServicio.DiasInicioCredito)));
      this.FechaPrimerPagoMax = new Date(this.addDays(FCH_PAGARE_SOL, Number(this.mensajeServicio.DiasInicioMaximoCredito)));
    } catch {}
    try {
        let FECHA_INICIO_CREDITO_REAL_CRE: Date = new Date(this.mensajeServicio.FECHA_INICIO_CREDITO_REAL_CRE);
        this.FormularioDatosReportes.controls['fechaPrimerPago'].setValue(FECHA_INICIO_CREDITO_REAL_CRE.toISOString().substring(0, 10));
     } catch {}
     try {
      this.FechaPagareMin = new Date(this.mensajeServicio.FechaPagareMin);
      this.FechaPagareMax = new Date(this.mensajeServicio.FechaPagareMax);
     } catch {

     }
    if (this.mensajeServicio.CuentasMupi === 'True') {
      this.numeroCuentaEnabled = true;
      this.entidadFinancieraEnabled = true;
      this.tipoCuentaEnabled = true;
    } else {
      this.numeroCuentaEnabled = false;
      this.entidadFinancieraEnabled = false;
      this.tipoCuentaEnabled = false;
    }
  }
  addDays(date: Date, days: number): Date {
    var dias = days;
    date.setDate(date.getDate() + dias);
    return date;
  }
}

