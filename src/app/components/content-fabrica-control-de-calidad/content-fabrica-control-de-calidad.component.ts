import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService} from 'src/app/services/documentos/documentos-visualizacion.service';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-content-fabrica-control-de-calidad',
  templateUrl: './content-fabrica-control-de-calidad.component.html',
  styleUrls: ['./content-fabrica-control-de-calidad.component.css']
})
export class ContentFabricaControlDeCalidadComponent implements OnInit {
  closeResult: string;
  // bkm
  mensajeServicio: DatosFabrica;
  controlCalidad: any[] = [];
  // bkm
  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              private documentoVisualizacion: DocumentosVisualizacionService) {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        // console.log(data);
      });
    this.controlCalidad = this.getControlCalidad();
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

  openCustomWidth(content) {
    this.modalService.open(content, {windowClass: 'custom-width-modal'});
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  public getControlCalidad(): any {
    if (this.mensajeServicio.NumeroCredito !== '' || this.mensajeServicio.NumeroCredito !== undefined ) {
      this.documentoVisualizacion.getControlCalidad(this.mensajeServicio.NumeroCredito, this.mensajeServicio.Cedula)
        .pipe(map(data => data["DOCUMENTOS"]))
        .subscribe((data: any) => {
          this.controlCalidad = data;
        });
    }
  }
}
