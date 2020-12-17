import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-login',
  templateUrl: './sidebar-login.component.html',
  styleUrls: ['./sidebar-login.component.css']
})
export class SidebarLoginComponent implements OnInit {

  username: string;
  etiquetaWarning: boolean;
  mensajeAlerta:string ='';
  anio;

  constructor(private loginService: LoginService, private router:Router) {
    this.anio = new Date().getFullYear();
  }

  ngOnInit() {
    this.etiquetaWarning= false;
  }

  getLogin(user: string, password: string ){
    this.loginService.getLogin(user, password).subscribe(
      (data: any) => {
        // this.tipos = data;
        // console.log(parametro);
        // this.username = data.username;
        // console.log(data);
        if (data.error ===  null) {
          // si esta logueado
          localStorage.setItem('usuario', data.username);//nombre de usuario
          localStorage.setItem('codigoSucursal', data.sucursal[0]);//codigo de sucursal
          localStorage.setItem('nombreSucursal', data.sucursal[1]);//nombre de sucursal
          localStorage.setItem('rolesUsuario', data.roles);//roles de usuario
          localStorage.setItem('emailUsuario', data.email);//roles de usuario
          this.loginService.isAutenticated = true;
          this.router.navigate(['inicio']).then(r => '');
        } else {
          // error de logueo
          this.etiquetaWarning = true;
          this.mensajeAlerta = data.error;
        }
        // this.nombre = data;
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
}
