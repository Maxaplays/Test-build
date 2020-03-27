import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-content-excepciones',
  templateUrl: './content-excepciones.component.html',
  styleUrls: ['./content-excepciones.component.css']
})
export class ContentExcepcionesComponent implements OnInit {
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
  }

  open(content) {
    this.modalService.open(content, {centered: true });
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }


}
