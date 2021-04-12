import { Component, OnInit } from '@angular/core';
import {DocumentosVisualizacionService} from '../../services/documentos/documentos-visualizacion.service';
import {map} from 'rxjs/operators';
import {ExportService} from '../../services/exportar/export.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-content-envio-documentos',
  templateUrl: './content-envio-documentos.component.html',
  styleUrls: ['./content-envio-documentos.component.css']
})
export class ContentEnvioDocumentosComponent implements OnInit {

  documentosEnviar: string[];
  marcarChecks = false;
  miDataInterior = [];
  advertenceMessage: string;
  creditosSeleccionados = [];
  successMessage: string;
  errorMessage: string;


  constructor(private documentoVisualizacion: DocumentosVisualizacionService,
              private exportService: ExportService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.documentosEnviar = this.getDocumentosEnviar();
  }

  public getDocumentosEnviar(): any {
    this.documentoVisualizacion.getDocumentosEnviar(localStorage.getItem('usuario'))
      .subscribe((data: any) => {
        this.documentosEnviar = data.DOCUMENTOS;
      });
  }

  agregar(data: string) {
    this.miDataInterior.push(data);
  }

  quitar(data) {
    this.miDataInterior = this.miDataInterior.filter(s => s !== data);
  }

  exportar() {
    this.exportService.exportToExcel(this.documentosEnviar, 'Creditos');
  }

  public enviarDocumentos(contentA, contentE): any {
    this.creditosSeleccionados = [];
    if (this.miDataInterior.length > 0) {
      for (let i = 0; i < this.miDataInterior.length; i++) {
        this.creditosSeleccionados.push(this.miDataInterior[i].ID_CRE);
      }
      this.documentoVisualizacion.postCreditosEnviar(this.creditosSeleccionados, localStorage.getItem('usuario'))
        .subscribe(
          (data: any) => {
            if ( data === true) {
              this.successMessage = 'Documentos enviados';
              this.documentosEnviar = this.getDocumentosEnviar();
            } else {
              this.errorMessage = 'Error en el envío de documentos';
              this.modalService.open(contentE, {windowClass: 'custom-width-error-modal'});
            }
          }
        );
    } else {
      this.advertenceMessage = 'Debe elegir al menos un crédito';
      this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
    }
  }
}
