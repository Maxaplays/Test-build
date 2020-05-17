import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DocumentosService } from '../../services/documentos.service';
import {map} from 'rxjs/operators';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';

import {FormControl} from '@angular/forms';
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
  // bkm
  mensajeServicio: DatosFabrica;
  // bkm
  minDate: Date;
  maxDate: Date;
  constructor(private modalService: NgbModal,
              private documentosService: DocumentosService,
              private fabricaService: FabricaService,
              private generacionDocs: GeneraDocService) {
    this.EntidadFinanciera = this.getEntidadFinanciera();
    this.TipoCuenta = this.getTipoCuenta();

    this.NumeroCuenta = this.getNumeroCuenta();
    const currentYear = new  Date () .getFullYear ();
    const Mont = new  Date () .getMonth();
    const day = new  Date ().getDay();
    this .minDate = new  Date (currentYear , Mont , -day);
    this .maxDate = new  Date (currentYear , Mont , day + 15 );


  }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        // console.log(data);
      });
  }

  openLg(content) {
    this.modalService.open(content);
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  getEntidadFinanciera(): any {
    this.documentosService.getEntidadFinanciera()
      .pipe(map (data => data["ENTI_FINA"]))
      .subscribe((data: any) => {
        this.EntidadFinanciera = data;
        console.log(this.EntidadFinanciera);
      });
  }
  generarDocumentos(content) {
    console.log('Inciar Proceso');
    let variable = new GeneracionDocumentos();
    let reporte1 = new ReporteWebserviceUx();
    let arregloReportes= new ReporteWebserviceUx[1]();
    arregloReportes[0] = reporte1;
    variable.ID_CRE = 'DEMOCC00066';
    variable.reportesImprimir = arregloReportes;
    variable.fechaPagare = '2020-01-01';
    variable.fechaPrimerPago = '2020-01-10';
    variable.entidadFinanciera = '';
    variable.TipoDeCuenta = '';
    variable.NumeroCuentaBancaria = '';
    variable.urlArchivoGenerado = '';
    variable.resultado = '';
    variable.respuestaTablaAmortizacion = '';
    variable.lblCuentasMupi = '';
    variable.usuario = 'rdelatorre';
    variable.ID_CLI = '0915651020';
    console.log(variable);
    this.generacionDocs.postGeneracionDocumentos(variable).subscribe(
      (data: any) => {
        let resultado = data;
        // if(resultado === 'Cliente ingresado exitosamente!'){
        //   this.successMessage = 'Cliente Guardado Exitosamente!';
        // } else {
        //   // Error
        //   this.errorMessage = data;
        this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
        // }
      });
  }
  getTipoCuenta(): any {
    if (this.NOMBRE_BANCO !== null || this.NOMBRE_BANCO !== undefined ) {
      this.documentosService.getTipoCuenta(this.NOMBRE_BANCO)
        .pipe(map (data => data["TIPO_CUENTA"]))
        .subscribe((data: any) => {
          this.TipoCuenta = data;
          console.log(this.TipoCuenta);
        });
    }
  }
  getNumeroCuenta(): any {
      this.documentosService.getNumeroCuenta(this.NOMBRE_BANCO, this.TIPO_BANCO)
        .pipe(map (data => data["NUMERO_CUENTA"]))
        .subscribe((data: any) => {
          this.NumeroCuenta = data;
          console.log(this.NumeroCuenta);
        });
  }
}

