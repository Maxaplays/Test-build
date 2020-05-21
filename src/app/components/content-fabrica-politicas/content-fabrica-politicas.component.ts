import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService, Excepcion} from '../../services/documentos/documentos-visualizacion.service';
import {map} from 'rxjs/operators';
import {Subject} from "rxjs";


@Component({
  selector: 'app-content-fabrica-politicas',
  templateUrl: './content-fabrica-politicas.component.html',
  styleUrls: ['./content-fabrica-politicas.component.css']
})
export class ContentFabricaPoliticasComponent implements OnInit {
  closeResult: string;

  private _error = new Subject<string>();
  private _success = new Subject<string>();
  staticAlertClosed = false;
  errorMessage: string;
  listadoErrores: string[];
  successMessage: string;
  paginaAcual = 1;
  // bkm
  mensajeServicio: DatosFabrica;
  politicas: any[] = [];
  excepciones: any[] = [];
  comentarioExcepcion;
  politicasExepcion: any;
  // bkm
  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              private documentoVisualizacion: DocumentosVisualizacionService) {
  }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        this.politicas = this.getPoliticas();
        // console.log(data);
      });
  }

  openLg(content) {
    this.modalService.open(content);
  }

  openCustomWidth(content) {
    this.modalService.open(content, {windowClass: 'custom-width-modal'});
  }

  openCustomWidthVariant(content, politica: any) {
    this.politicasExepcion = politica;
    this.excepciones = this.getExcepciones(politica.ID_VAL);
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  public getPoliticas(): any {
    if (this.mensajeServicio.NumeroCredito !== '' || this.mensajeServicio.NumeroCredito !== undefined ) {
      this.documentoVisualizacion.getPoliticas(this.mensajeServicio.NumeroCredito, this.mensajeServicio.Cedula)
      // this.documentoVisualizacion.getPoliticas('AC0101012', '1706689971')
        .pipe(map(data => data["DOCUMENTOS"]))
        .subscribe((data: any) => {
          this.politicas = data;
        });
    }
  }

  public getExcepciones(ID_VAL: string): any {
    if (ID_VAL !== undefined || ID_VAL !== '') {
      this.documentoVisualizacion.getExcepciones(ID_VAL)
        // this.documentoVisualizacion.getRequisitos('AC0101012', '1706689971')
        .pipe(map(data => data["EXCEPCIONES"]))
        .subscribe((data: any) => {
          this.excepciones = data;
        });
    }
  }

  guardarExcepcion() {
    const excepcion: Excepcion = new Excepcion();
    excepcion.ID_VPOL = this.politicasExepcion.ID_VAL;
    excepcion.IDE_CRE = this.mensajeServicio.NumeroCredito;
    excepcion.Tipo = 'Requisito';
    excepcion.USR_EXC_VAL = localStorage.getItem('usuario');
    excepcion.OBSER_VAL_EXC_VAL = this.comentarioExcepcion;
    this.documentoVisualizacion.postExcepcion(excepcion).subscribe(
      (data: any) => {
        if (data.resultado !== null) {
          this.modalService.dismissAll();
          let mensajeSucces = '';
          this.excepciones = this.getExcepciones(this.politicasExepcion["ID_VAL"]);
          this.politicas = this.getPoliticas();
          for (const mensaje of data.listaResultado) {
            mensajeSucces += mensaje + '\n';
          }
          this.successMessage = mensajeSucces;
          this.comentarioExcepcion = '';
        }
      }
    );
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
  }
  solicitarAnalisis(content) {
    this.fabricaService.getSolicitarAnalisis(this.mensajeServicio.NumeroCredito,
                                            localStorage.getItem('usuario')).subscribe(
        data => {
          var resultado: number = data.toString().indexOf('Solicitud en estado: ');
          if (resultado >= 0) {
            this.mensajeServicio.Estado = 'Cancelada';
            this.successMessage = data.toString();
          } else {
            this.errorMessage = data.toString();
            this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
          }
          });
  }
}
