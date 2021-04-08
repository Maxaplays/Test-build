import { Component, OnInit } from '@angular/core';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TarjetasTrelloService } from 'src/app/services/tarjetasTrello/tarjetas-trello.service';

@Component({
  selector: 'app-prioridad-uno',
  templateUrl: './prioridad-uno.component.html',
  styleUrls: ['./prioridad-uno.component.css']
})
export class PrioridadUnoComponent implements OnInit {
  closeResult = '';
  currentRate = '';
  public infos: Array<Object> = [
    {id: 1, name:'Superman'},
    {id: 2, name:'Batman'},
    {id: 5, name:'BatGirl'},
    {id: 3, name:'Robin'},
    {id: 4, name:'Flash'}
];

  constructor(private modalService: NgbModal, private tarjetaService: TarjetasTrelloService) { 

    
  }

  ngOnInit() {


  }
  changeClient(event){

    this.llamar(event.toString())    
  }
  async llamar(xd){
    console.log(xd)
    this.tarjetaService.tarjetaServicio=[]
    this.tarjetaService.login(xd).then(()=>{
      this.infos = this.tarjetaService.tarjetaServicio
    }
     
    )
    
    
  }

  saveVoto(valor,id,peso){

    this.tarjetaService.votar(valor,id,peso)
    this.modalService.dismissAll()
  }


  open(content) {
    setTimeout(() => {
      this.modalService.dismissAll();
    }, 90000);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    setTimeout(this.modalService.dismissAll, 1000);
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

