import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService, Excepcion} from '../../services/documentos/documentos-visualizacion.service';
import {map} from 'rxjs/operators';
import {ArchivosService} from '../../services/archivos/archivos.service';
import {Subject} from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { DocumentosService } from 'src/app/services/documentos.service';



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
  advertenceMessage: string;


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
  documentosSubidos: any[] = [];
  listadoAdvertencia: string[];
  listadoErrores: string[];
  comentarioExcepcion;
  desmarcar;
  btnSolicitarAnulacion = true;
  SubirArchivos = true;
  BtnEntregarCarpeta = true;
  btnSolicitarAnalisis = true;
  ASPxActualizarSOL = true;
  SolicitarExcepcion = true;
  loading: boolean;
  // bkm

  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              private documentoVisualizacion: DocumentosVisualizacionService,
              private archivosService: ArchivosService,
              private router: Router,
              private documentosService: DocumentosService) {

  }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        this.acoplarPantalla(this.mensajeServicio.Estado);
        this.requisitios = this.getRequisitos();
        // console.log(data);
      });
  }

  openLg(content) {
    this.getDocumentosCredito();
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

  onFileSelected(event, contentE, contentA) {
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
    if (this.miDataInterior.length > 0) {
      this.archivoSeleccionado = <File> event.target.files[0];
      this.Archivos.push(this.archivoSeleccionado);
      this.loading = true;
      this.archivosService.postArchivo(this.Archivos, this.mensajeServicio.NumeroCredito,
        localStorage.getItem('usuario'), nombreArchivo, politicasValidacion, 'Requisito')
        .subscribe(
          (data: any) => {
            if (data.listaResultado.length > 0) {
              this.loading = false;
              this.successMessage = 'Archivo cargado';
            }
            if (data.listaErrores.length > 0) {
              let mensajeError = '';
              this.listadoErrores = data.listaErrores;
              this.loading = false;
              this.errorMessage = mensajeError;
              this.modalService.open(contentE, {windowClass: 'custom-width-error-modal'});
            }
            if (data.listaAdvertencias.length > 0) {
              let mensajeAdvertencia = '';
              this.listadoAdvertencia = data.listaAdvertencias;
              this.loading = false;
              this.advertenceMessage = mensajeAdvertencia;
              this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
              if (this.listadoAdvertencia[0][0] === 'S') {
                setTimeout (() => {
                }, 3500);
                this.router.navigate(['/fabrica/consulta-general']);
              }
            }
            this.requisitios = this.getRequisitos();
          }
        );
      if (this.miDataInterior.length === this.requisitios.length) {
        this.desmarcar = false;
        this.marcarChecks = !this.marcarChecks;
        for (let i = 0; i < this.requisitios.length; i++) {
          this.miDataInterior = this.miDataInterior.filter(s => s !== this.requisitios[i]);
          this.miDataInterior = [];
          this.subirArchivo();
          this.desmarcar = false;
          this.Archivos = [];
        }
      }
      this.miDataInterior = [];
      this.subirArchivo();
      this.desmarcar = false;
      this.Archivos = [];
      this.router.navigate(['/fabrica/nueva-solicitud/requisitos']);
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
  incializarCredito() {
    this.fabricaService.getRetomarCredito(this.mensajeServicio.NumeroCredito,
    localStorage.getItem('usuario')).pipe(map (data => data['Table1'][0])).subscribe(
              (data: DatosFabrica) => {
                // console.log(data);
                this.acoplarPantalla(this.mensajeServicio.Estado);
                this.getRequisitos();
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
                      this.BtnEntregarCarpeta = true;
                      this.btnSolicitarAnalisis = false;
                      this.ASPxActualizarSOL = false;
                      this.SolicitarExcepcion = false;
                    } else {
                      if (lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Rechazada' ||
                        lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'RechazadaCC' ||
                        lblEstadoSolicitud === 'Caducada' || lblEstadoSolicitud === 'Autorización Caducada' ||
                        lblEstadoSolicitud === 'Consultada') {
                        // this.pestaniasIngreso.controls['selectTabs'].setValue('Políticas');
                        // ('Bloqueado 2' + lblEstadoSolicitud);
                        this.ASPxActualizarSOL = false;
                        this.btnSolicitarAnulacion = false;
                        this.BtnEntregarCarpeta = false;
                        this.btnSolicitarAnalisis = false;
                        this.SubirArchivos = false;
                        // ASPxUploadControl1.Visible = false;
                        // ASPxUploadControl2.Visible = false;
                        // ASPxUploadControl3.Visible = false;
                        // btnGenerarReportesDinamicos.Visible = false;
                        // btnRefrescar.Visible = false;
                        // BtnGuardar.Visible = false;
                      } else {
                        if (lblEstadoSolicitud === 'Cancelada') {
                          console.log('Bloqueado 3' + lblEstadoSolicitud);
                          this.ASPxActualizarSOL = false;
                          this.btnSolicitarAnulacion = false;
                          this.BtnEntregarCarpeta = false;
                          this.btnSolicitarAnalisis = false;
                          this.SubirArchivos = false;
                        } else {
                          if (lblEstadoSolicitud === 'Autorizada') {
                            // console.log('Bloqueado 6' + lblEstadoSolicitud);
                            this.btnSolicitarAnulacion = false;
                            this.BtnEntregarCarpeta = true;
                            this.btnSolicitarAnalisis = false;
                            this.ASPxActualizarSOL = false;
                            this.SolicitarExcepcion = false;
                          } else {
                            if (lblEstadoSolicitud === 'Retornada') {
                              // console.log('Bloqueado 6' + lblEstadoSolicitud);
                              this.btnSolicitarAnulacion = false;
                              this.BtnEntregarCarpeta = true;
                              this.btnSolicitarAnalisis = false;
                              this.ASPxActualizarSOL = false;
                              this.SolicitarExcepcion = false;
                            }
                          }
                        }
                      }
                    }
                } else {
                  // console.log('Bloqueado 5' + lblEstadoSolicitud);
                  this.btnSolicitarAnulacion = false;
                  this.SubirArchivos = false;
                  this.BtnEntregarCarpeta = true;
                  this.btnSolicitarAnalisis = false;
                  this.ASPxActualizarSOL = false;
                  this.SolicitarExcepcion = false;
                  this.SubirArchivos = false;
                }
  }
  guardarExcepcion(contentA, contentE) {
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
          if (data.listaResultado.length > 0) {
            this.successMessage = 'Excepción generada';
          }
          if (data.listaErrores.length > 0) {
            let mensajeError = '';
            for (const mensaje of data.listaErrores) {
              mensajeError += mensaje + '\n';
            }
            this.errorMessage = mensajeError;
            this.modalService.open(contentE, {windowClass: 'custom-width-error-modal'});
          }
          if (data.listaAdvertencia.length > 0) {
            let mensajeAdvertencia = '';
            for (const mensaje of data.listaAdvertencia) {
              mensajeAdvertencia += mensaje + '\n';
            }
            this.advertenceMessage = mensajeAdvertencia;
            this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
            if (mensajeAdvertencia[0] === 'S') {
              setTimeout (() => {
              }, 3500);
              this.router.navigate(['/fabrica/consulta-general']);
            }
          }
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
    setTimeout (() => {
    }, 3500);
    this.router.navigate(['/fabrica/consulta-general']);
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
    setTimeout (() => {
    }, 3500);
    this.router.navigate(['/fabrica/consulta-general']);
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
            this.loading = false;
            // @ts-ignore
            this.documentosSubidos = this.getDocumentosCredito();

          }
        );
    }
  }
}
