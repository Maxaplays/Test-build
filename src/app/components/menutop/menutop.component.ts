import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-menutop',
  templateUrl: './menutop.component.html',
  styleUrls: ['./menutop.component.css']
})
export class MenutopComponent implements OnInit {
  closeResult: string;
  usuario: string;
  nombreSucursal: string;
  sucursales:any[];

  constructor(private modalService: NgbModal,private menuService:MenuService) { }

  ngOnInit() {
    this.usuario=localStorage.getItem('usuario');
    this.nombreSucursal=localStorage.getItem('nombreSucursal');
    this.getSucursales();
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
      return  `with: ${reason}`;
    }
  }
  
  openSM(content) {
    this.modalService.open(content, {windowClass: 'custom-sm-modal'});
  }

  getSucursales(){
    this.menuService.getSucursales(this.usuario).subscribe(
      (data: any) => {
        this.sucursales=data.USUARIOS_SUCURSAL;
        console.log(this.sucursales);
      }, ( errorServicio ) => {
        console.log('Error');
      }
    );
  }
}
