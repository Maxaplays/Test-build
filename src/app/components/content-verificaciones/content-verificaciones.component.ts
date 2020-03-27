import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-content-verificaciones',
  templateUrl: './content-verificaciones.component.html',
  styleUrls: ['./content-verificaciones.component.css']
})
export class ContentVerificacionesComponent implements OnInit {
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

