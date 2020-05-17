import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService} from '../../services/documentos/documentos-visualizacion.service';
import {map} from 'rxjs/operators';
import {ArchivosService} from '../../services/archivos/archivos.service';



@Component({
  selector: 'app-content-fabrica-requisitos',
  templateUrl: './content-fabrica-requisitos.component.html',
  styleUrls: ['./content-fabrica-requisitos.component.css']
})
export class ContentFabricaRequisitosComponent implements OnInit {
  closeResult: string;
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
    console.log(this.mensajeServicio.NumeroCredito);
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
      console.log(this.miDataInterior);
    } else {
      this.marcarChecks = !this.marcarChecks;
      for (let i = 0; i < this.requisitios.length; i++) {
        this.miDataInterior = this.miDataInterior.filter(s => s !== this.requisitios[i]);
      }
      console.log(this.miDataInterior);
    }
  }

  onFileSelected(event) {
    for (let i = 0; i < this.miDataInterior.length ; i++) {
    this.archivoSeleccionado = <File> event.target.files[i];
    this.Archivos.push(<File> event.target.files[i]);
    console.log(this.archivoSeleccionado);
    console.log(this.Archivos);
    const fd = new FormData();
    /*fd.append('image', this.archivoSeleccionado, this.archivoSeleccionado.name);
    this.http.post('http://localhost:4200', fd)
      .subscribe(res => {
        console.log(res);
      });*/
    this.archivosService.postArchivo(this.Archivos)
      .subscribe(
        (data: any) => {

        }
      );
  }
  }

  agregar(data: string) {
    this.miDataInterior.push(data);
    console.log(this.miDataInterior);
  }

  quitar(data) {
    this.miDataInterior = this.miDataInterior.filter(s => s !== data);
    console.log(this.miDataInterior);
  }

}
