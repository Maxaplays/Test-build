import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService, Excepcion} from '../../services/documentos/documentos-visualizacion.service';
import {map} from 'rxjs/operators';
import {ArchivosService} from '../../services/archivos/archivos.service';
import {Subject} from 'rxjs';



@Component({
  selector: 'app-content-fabrica-requisitos',
  templateUrl: './content-fabrica-requisitos.component.html',
  styleUrls: ['./content-fabrica-requisitos.component.css']
})
export class ContentFabricaRequisitosComponent implements OnInit {
  closeResult: string;
  private _error = new Subject<string>();
  private _success = new Subject<string>();
  staticAlertClosed = false;
  errorMessage: string;
  successMessage: string;

  paginaAcual = 1;
  marcarChecks = false;
  Archivos: File[] = [];
  archivoSeleccionado: File = null;
  miDataInterior = [];
  requisitoExepcion: any = [];
  // bkm
  mensajeServicio: DatosFabrica;
  requisitios: any[] = [];
  excepciones: any[] = [];
  comentarioExcepcion;
  // bkm

  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              private documentoVisualizacion: DocumentosVisualizacionService,
              private archivosService: ArchivosService) {

  }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        this.requisitios = this.getRequisitos();
        // console.log(data);
      });
  }

  openLg(content) {
    this.modalService.open(content);
  }

  openCustomWidth(content) {
    this.modalService.open(content, {windowClass: 'custom-width-modal'});
  }

  openCustomWidthVariant(content, requisito: any) {
    this.requisitoExepcion = requisito;
    this.excepciones = this.getExcepciones(requisito.ID_VAL);
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  public getRequisitos(): any {
    if (this.mensajeServicio.NumeroCredito !== '') {
      this.documentoVisualizacion.getRequisitos(this.mensajeServicio.NumeroCredito, this.mensajeServicio.Cedula)
      // this.documentoVisualizacion.getRequisitos('AC0101012', '1706689971')
        .pipe(map(data => data["DOCUMENTOS"]))
        .subscribe((data: any) => {
          this.requisitios = data;
        });
    }
  }

  marcarTodos(e) {
    if (e.target.checked) {
      this.marcarChecks = !this.marcarChecks;
      for (let i = 0; i < this.requisitios.length; i++) {
        this.miDataInterior.push(this.requisitios[i]);
      }
    } else {
      this.marcarChecks = !this.marcarChecks;
      for (let i = 0; i < this.requisitios.length; i++) {
        this.miDataInterior = this.miDataInterior.filter(s => s !== this.requisitios[i]);
      }
    }
  }

  onFileSelected(event) {
    let nombreArchivo = '';
    let politicasValidacion = '';
    for (let i = 0; i < this.miDataInterior.length ; i++) {
      if ( i < this.miDataInterior.length - 1) {
        nombreArchivo += this.miDataInterior[i].NOM_POL + ',';
        politicasValidacion += this.miDataInterior[i].ID_VAL + ',';

      } else if ( i === this.miDataInterior.length - 1) {
        nombreArchivo += this.miDataInterior[i].NOM_POL;
        politicasValidacion += this.miDataInterior[i].ID_VAL;
      }
    }
    console.log(nombreArchivo);
    if (this.miDataInterior.length > 0) {
      this.archivoSeleccionado = <File> event.target.files[0];
      this.Archivos.push(this.archivoSeleccionado);
      this.archivosService.postArchivo(this.Archivos, this.mensajeServicio.NumeroCredito, localStorage.getItem('usuario'), nombreArchivo, politicasValidacion, 'Requisito')
        .subscribe(
          (data: any) => {
            if (data.listaResultado !== null) {
              this.requisitios = this.getRequisitos();
              let mensajeSucces = '';
              for (const mensaje of data.listaResultado) {
                mensajeSucces += mensaje + '\n';
              }
              this.successMessage = mensajeSucces;
            }
          }
        );
    }
  }

  agregar(data: string) {
    this.miDataInterior.push(data);
  }

  quitar(data) {
    this.miDataInterior = this.miDataInterior.filter(s => s !== data);
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
    excepcion.ID_VPOL = this.requisitoExepcion.ID_VAL;
    excepcion.IDE_CRE = this.mensajeServicio.NumeroCredito;
    excepcion.Tipo = 'Requisito';
    excepcion.USR_EXC_VAL = localStorage.getItem('usuario');
    excepcion.OBSER_VAL_EXC_VAL = this.comentarioExcepcion;
    this.documentoVisualizacion.postExcepcion(excepcion).subscribe(
      (data: any) => {
        if (data.resultado !== null) {
          this.modalService.dismissAll();
          let mensajeSucces = '';
          this.excepciones = this.getExcepciones(this.requisitoExepcion["ID_VAL"]);
          this.requisitios = this.getRequisitos();
          for (const mensaje of data.listaResultado) {
            mensajeSucces += mensaje + '\n';
          }
          this.successMessage = mensajeSucces;
          this.comentarioExcepcion = '';
        }
      }
    );
  }

  subirArchivo() {
    if (this.miDataInterior.length > 0) {return true; } else { return false; }
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
