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
    this.EntidadFinanciera = this.getEntidadFinanciera();
    this.TipoCuenta = this.getTipoCuenta();
    this.NumeroCuenta = this.getNumeroCuenta();
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
  getEntidadFinanciera(): any {
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
    variable.lblCuentasMupi = '';
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
      this.documentosService.getTipoCuenta(this.NOMBRE_BANCO)
        .pipe(map (data => data["TIPO_CUENTA"]))
        .subscribe((data: any) => {
          this.TipoCuenta = data;
          // console.log(this.TipoCuenta);
        });
    // }
  }
  getNumeroCuenta(): any {
      this.documentosService.getNumeroCuenta(this.NOMBRE_BANCO, this.TIPO_BANCO)
        .pipe(map (data => data["NUMERO_CUENTA"]))
        .subscribe((data: any) => {
          this.NumeroCuenta = data;
          // console.log(this.NumeroCuenta);
        });
  }
}

