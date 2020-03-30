import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-content-fabrica-solicitud-credito',
  templateUrl: './content-fabrica-solicitud-credito.component.html',
  styleUrls: ['./content-fabrica-solicitud-credito.component.css']
})
export class ContentFabricaSolicitudCreditoComponent implements OnInit {
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
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

