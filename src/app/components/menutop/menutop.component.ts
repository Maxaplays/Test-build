import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from 'src/app/services/menu/menu.service';
import { Router } from '@angular/router';
import { FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menutop',
  templateUrl: './menutop.component.html',
  styleUrls: ['./menutop.component.css']
})
export class MenutopComponent implements OnInit {

  classApplied = false;
  closeResult: string;
  // bkm
  usuario: string = "";
  nombreSucursal: string;
  sucursales: any[];
  // bkm

  toggleClass() {
    this.classApplied = !this.classApplied;
  }

  constructor(private modalService: NgbModal, private menuService: MenuService,
              private router: Router,
              private fabricaService: FabricaService,
              private loginService: LoginService) {
      this.usuario = localStorage.getItem('usuario');
      this.nombreSucursal = localStorage.getItem('nombreSucursal');
      this.getSucursales();
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
      return  `with: ${reason}`;
    }
  }

  openSM(content) {
    this.modalService.open(content, {windowClass: 'custom-sm-modal'});
  }

  getSucursales() {
    this.menuService.getSucursales(this.usuario).subscribe(
      (data: any) => {
        this.sucursales = data.USUARIOS_SUCURSAL;
        // console.log(this.sucursales);
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
  cambiarSucursal(idSucursal: string) {
      // console.log('Cambio sucursal: '+ idSucursal);
      const nombreSucursal = this.sucursales.find(element => element.ID_SUC === idSucursal);
      // console.log(nombreSucursal);
      this.nombreSucursal = nombreSucursal.NOM_SUC;
      localStorage.setItem('nombreSucursal', nombreSucursal.NOM_SUC);
      localStorage.setItem('codigoSucursal', idSucursal);
  }
  cerrarSesion() {
      localStorage.removeItem('usuario');
      localStorage.removeItem('codigoSucursal');
      localStorage.removeItem('emailUsuario');
      localStorage.removeItem('nombreSucursal');
      localStorage.removeItem('rolesUsuario');
      localStorage.removeItem('idSucursal');
      this.loginService.isAutenticated = false;
      this.fabricaService = null;
      this.router.navigate(['']);
      // console.log("Cerrada Sesion!");
  }
}
