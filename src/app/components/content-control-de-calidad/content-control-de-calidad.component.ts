import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-content-control-de-calidad',
  templateUrl: './content-control-de-calidad.component.html',
  styleUrls: ['./content-control-de-calidad.component.css']
})
export class ContentControlDeCalidadComponent implements OnInit {

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
