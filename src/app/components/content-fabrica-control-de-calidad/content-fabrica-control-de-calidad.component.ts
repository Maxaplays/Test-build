import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService, Excepcion} from 'src/app/services/documentos/documentos-visualizacion.service';
import {map} from 'rxjs/operators';
import {ArchivosService} from '../../services/archivos/archivos.service';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-content-fabrica-control-de-calidad',
  templateUrl: './content-fabrica-control-de-calidad.component.html',
  styleUrls: ['./content-fabrica-control-de-calidad.component.css']
})
export class ContentFabricaControlDeCalidadComponent implements OnInit {
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
  btnSolicitarAnulacion = true;
  SubirArchivos = true;
  BtnEntregarCarpeta = true;
  btnSolicitarAnalisis = true;
  ASPxActualizarSOL = true;
  SolicitarExcepcion = true;
  // bkm
  mensajeServicio: DatosFabrica;
  controlCalidad: any[] = [];
  excepciones: any[] = [];
  comentarioExcepcion;
  controlExepcion: any;
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
        this.acoplarPantalla(this.mensajeServicio.Estado);
        this.controlCalidad = this.getControlCalidad();
        // console.log(data);
      });
  }

  openLg(content) {
    this.modalService.open(content);
  }

  openCustomWidth(content) {
    this.modalService.open(content, {windowClass: 'custom-width-modal'});
  }

  openCustomWidthVariant(content, control: any) {
    this.controlExepcion = control;
    this.excepciones = this.getExcepciones(control.ID_VAL);
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  public getControlCalidad(): any {
    if (this.mensajeServicio.NumeroCredito !== '' || this.mensajeServicio.NumeroCredito !== undefined ) {
      this.documentoVisualizacion.getControlCalidad(this.mensajeServicio.NumeroCredito, this.mensajeServicio.Cedula)
      // this.documentoVisualizacion.getControlCalidad('AC0101012', '1706689971')
        .pipe(map(data => data["DOCUMENTOS"]))
        .subscribe((data: any) => {
          this.controlCalidad = data;
        });
    }
  }

  marcarTodos(e) {
    if (e.target.checked) {
      this.marcarChecks = !this.marcarChecks;
      for (let i = 0; i < this.controlCalidad.length; i++) {
        this.miDataInterior.push(this.controlCalidad[i]);
      }
    } else {
      this.marcarChecks = !this.marcarChecks;
      for (let i = 0; i < this.controlCalidad.length; i++) {
        this.miDataInterior = this.miDataInterior.filter(s => s !== this.controlCalidad[i]);
      }
    }
  }

  onFileSelected(event) {
    let nombreArchivo = '';
    let controlCalidadValidacion = '';
    for (let i = 0; i < this.miDataInterior.length ; i++) {
      if ( i < this.miDataInterior.length - 1) {
        nombreArchivo += this.miDataInterior[i].NOM_POL + ',';
        controlCalidadValidacion += this.miDataInterior[i].ID_VAL + ',';

      } else if ( i === this.miDataInterior.length - 1) {
        nombreArchivo += this.miDataInterior[i].NOM_POL;
        controlCalidadValidacion += this.miDataInterior[i].ID_VAL;
      }

    }
    console.log(nombreArchivo);
    if (this.miDataInterior.length > 0) {
      this.archivoSeleccionado = <File> event.target.files[0];
      this.Archivos.push(this.archivoSeleccionado);
      this.archivosService.postArchivo(this.Archivos, this.mensajeServicio.NumeroCredito, localStorage.getItem('usuario'), nombreArchivo, controlCalidadValidacion, 'Control')
        .subscribe(
          (data: any) => {
            if (data.listaResultado !== null) {
              this.controlCalidad = this.getControlCalidad();
              let mensajeSucces = '';
              for (const mensaje of data.listaResultado) {
                mensajeSucces += mensaje + '\n';
              }
              console.log(mensajeSucces);
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

  subirArchivo() {
    if (this.miDataInterior.length > 0) {return true; } else { return false; }
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
    excepcion.ID_VPOL = this.controlExepcion.ID_VAL;
    excepcion.IDE_CRE = this.mensajeServicio.NumeroCredito;
    excepcion.Tipo = 'Calidad';
    excepcion.USR_EXC_VAL = localStorage.getItem('usuario');
    excepcion.OBSER_VAL_EXC_VAL = this.comentarioExcepcion;
    this.documentoVisualizacion.postExcepcion(excepcion).subscribe(
      (data: any) => {
        if (data.resultado !== null) {
          this.modalService.dismissAll();
          let mensajeSucces = '';
          this.excepciones = this.getExcepciones(this.controlExepcion["ID_VAL"]);
          this.controlCalidad = this.getControlCalidad();
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
  incializarCredito() {
    this.fabricaService.getRetomarCredito(this.mensajeServicio.NumeroCredito,
    localStorage.getItem('usuario')).pipe(map (data => data['Table1'][0])).subscribe(
              (data: DatosFabrica) => {
                // console.log(data);
                this.acoplarPantalla(this.mensajeServicio.Estado);
                this.controlCalidad = this.getControlCalidad();
              });
  }
  acoplarPantalla(lblEstadoSolicitud: string) {
    console.log('Acoplando Pantalla: ' + lblEstadoSolicitud);
    if (lblEstadoSolicitud === 'Documental' || lblEstadoSolicitud === 'Cancelada' ||
        lblEstadoSolicitud === 'Aprobada' || lblEstadoSolicitud === 'Autorizada' ||
        lblEstadoSolicitud === 'Re-Documental' || lblEstadoSolicitud === 'RechazadaCC' ||
        lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Caducada' ||
        lblEstadoSolicitud === 'Perfil No Aprobado' || lblEstadoSolicitud === 'Retornada' ||
        lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'Rechazada' ||
        lblEstadoSolicitud === 'Autorización Caducada') {
          console.log('Bloqueado 0' + lblEstadoSolicitud);
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
                          lblEstadoSolicitud === 'Caducada' || lblEstadoSolicitud === 'Autorización Caducada') {
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
                              // console.log('Bloqueado 3' + lblEstadoSolicitud);
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
                              } else {
                                // console.log('Bloqueado 4' + lblEstadoSolicitud);
                                this.btnSolicitarAnulacion = true;
                                this.BtnEntregarCarpeta = false;
                                this.btnSolicitarAnalisis = false;
                                this.SubirArchivos = false;
                              }
                            }
                        }
                    }
                } else {
                  console.log('Bloqueado 5' + lblEstadoSolicitud);
                    // pageControlCliente.TabPages[7].Enabled = false;
                }
  }
}
