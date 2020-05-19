import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService} from 'src/app/services/documentos/documentos-visualizacion.service';
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
  // bkm
  mensajeServicio: DatosFabrica;
  controlCalidad: any[] = [];
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

  openCustomWidthVariant(content) {
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
      this.archivosService.postArchivo(this.Archivos, this.mensajeServicio.NumeroCredito, localStorage.getItem('usuario'), nombreArchivo, controlCalidadValidacion)
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
}
