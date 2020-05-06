import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';
import {DocumentosVisualizacionService} from '../../services/documentos/documentos-visualizacion.service';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-content-fabrica-politicas',
  templateUrl: './content-fabrica-politicas.component.html',
  styleUrls: ['./content-fabrica-politicas.component.css']
})
export class ContentFabricaPoliticasComponent implements OnInit {
  closeResult: string;
  // bkm
  mensajeServicio: DatosFabrica;
  politicas: any[] = [];
  // bkm
  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              private documentoVisualizacion: DocumentosVisualizacionService) {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        // console.log(data);
      });
    this.politicas = this.getPoliticas();
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

  public getPoliticas(): any {
    if (this.mensajeServicio.NumeroCredito !== '' || this.mensajeServicio.NumeroCredito !== undefined ) {
      this.documentoVisualizacion.getPoliticas(this.mensajeServicio.NumeroCredito, this.mensajeServicio.Cedula)
        .pipe(map(data => data["DOCUMENTOS"]))
        .subscribe((data: any) => {
          this.politicas = data;
        });
    }
  }
}
