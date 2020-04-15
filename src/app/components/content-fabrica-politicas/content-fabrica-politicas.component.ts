import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';


@Component({
  selector: 'app-content-fabrica-politicas',
  templateUrl: './content-fabrica-politicas.component.html',
  styleUrls: ['./content-fabrica-politicas.component.css']
})
export class ContentFabricaPoliticasComponent implements OnInit {
  closeResult: string;
  //bkm
  mensajeServicio: DatosFabrica;
  //bkm
  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService) {}

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        //console.log(data);
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
  
}
