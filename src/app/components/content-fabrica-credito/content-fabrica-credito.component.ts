import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-content-fabrica-credito',
  templateUrl: './content-fabrica-credito.component.html',
  styleUrls: ['./content-fabrica-credito.component.css']
})
export class ContentFabricaCreditoComponent implements OnInit {

  closeResult: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }


}
