import { Component, OnInit } from '@angular/core';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';




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


  public areas: Array<Object> = [
    {id: 1, nombre:'Area 1'},
    {id: 2, nombre:'Area 2'},
    {id: 3, nombre:'Area 3'},
  ];

  constructor(private modalService: NgbModal) { 

    
  }

  ngOnInit() {


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

