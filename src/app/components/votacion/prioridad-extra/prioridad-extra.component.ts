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
  currentRate='';
  public infos: Array<Object> = [
    {id: 1, name:'Superman'},
    {id: 2, name:'Batman'},
    {id: 5, name:'BatGirl'},
    {id: 3, name:'Robin'},
    {id: 4, name:'Flash'}
];
public item: Array<Object> = [
  {id: 1, name:'Superman'},
  {id: 2, name:'Batman'},
  {id: 5, name:'BatGirl'},
  {id: 3, name:'Robin'},
  {id: 4, name:'Flash'}
];
  constructor(private modalService: NgbModal, private tarjetaService: TarjetasTrelloService) { }

  public areas: Array<Object> = [
    {id: 1, nombre:'Area 1'},
    {id: 2, nombre:'Area 2'},
    {id: 3, nombre:'Area 3'},
  ];

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
  
  open(content) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalService.dismissAll();
    });
    
  }



  saveVoto(valor,id,peso){
    
    this.tarjetaService.votar(valor,id,peso)
    this.modalService.dismissAll()
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

