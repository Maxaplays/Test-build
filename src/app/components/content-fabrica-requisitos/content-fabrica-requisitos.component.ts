import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService} from '../../services/documentos/documentos-visualizacion.service';
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
  // bkm
  mensajeServicio: DatosFabrica;
  requisitios: any[] = [];
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

  openCustomWidthVariant(content) {
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
      this.archivosService.postArchivo(this.Archivos, this.mensajeServicio.NumeroCredito, localStorage.getItem('usuario'), nombreArchivo, politicasValidacion)
        .subscribe(
          (data: any) => {
            if (data.listaResultado !== null) {
              this.requisitios = this.getRequisitos();
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
