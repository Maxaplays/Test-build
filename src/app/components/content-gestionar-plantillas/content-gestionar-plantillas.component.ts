import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-content-gestionar-plantillas',
  templateUrl: './content-gestionar-plantillas.component.html',
  styleUrls: ['./content-gestionar-plantillas.component.css']
})

export class ContentGestionarPlantillasComponent implements OnInit {

  closeResult: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

}
