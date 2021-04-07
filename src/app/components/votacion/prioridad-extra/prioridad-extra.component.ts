import { Component, OnInit } from '@angular/core';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TarjetasTrelloService } from 'src/app/services/tarjetasTrello/tarjetas-trello.service';

@Component({
  selector: 'app-prioridad-extra',
  templateUrl: './prioridad-extra.component.html',
  styleUrls: ['./prioridad-extra.component.css']
})
export class PrioridadExtraComponent implements OnInit {
  closeResult = '';
  private infos: Array<Object> = [
    
];

  constructor(private modalService: NgbModal, private tarjetaService: TarjetasTrelloService) { 

    
  }

  ngOnInit() {
    this.tarjetaService.login()
    this.infos =this.tarjetaService.tarjetaServicio
  }
  ngOnDestroy(){
    this.infos=[];
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  

}

