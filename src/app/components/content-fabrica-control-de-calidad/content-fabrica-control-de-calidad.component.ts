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
  paginaAcual = 1;
  marcarChecks = false;
  // bkm
  mensajeServicio: DatosFabrica;
  controlCalidad: any[] = [];
  // bkm
  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              private documentoVisualizacion: DocumentosVisualizacionService) {

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
    } else {
      this.marcarChecks = !this.marcarChecks;
    }
  }
}
