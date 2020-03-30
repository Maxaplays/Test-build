import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-content-fabrica-politicas',
  templateUrl: './content-fabrica-politicas.component.html',
  styleUrls: ['./content-fabrica-politicas.component.css']
})
export class ContentFabricaPoliticasComponent implements OnInit {
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
