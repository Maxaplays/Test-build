import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';

@Component({
  selector: 'app-content-fabrica-credito',
  templateUrl: './content-fabrica-credito.component.html',
  styleUrls: ['./content-fabrica-credito.component.css']
})
export class ContentFabricaCreditoComponent implements OnInit {

  closeResult: string;

  //bkm
  mensajeServicio: DatosFabrica;
  //bkm

  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService) {

  }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        //console.log(data);
      });
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  enviarNuevoMensaje(){
    this.fabricaService.changeMessage(new DatosFabrica());
  }
}
