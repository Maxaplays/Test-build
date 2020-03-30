import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-content-fabrica-requisitos',
  templateUrl: './content-fabrica-requisitos.component.html',
  styleUrls: ['./content-fabrica-requisitos.component.css']
})
export class ContentFabricaRequisitosComponent implements OnInit {
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
