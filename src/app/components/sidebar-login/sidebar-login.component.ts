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

  constructor(private loginService: LoginService, private router:Router) { }

  ngOnInit() {
    this.etiquetaWarning= false;
  }

  getLogin(user: string, password: string ){
    this.loginService.getLogin(user, password).subscribe(
      (data: any) => {
        // this.tipos = data;
        // console.log(parametro);
        // this.username = data.username;
        console.log(data);
        if (data.username !==  '') {
          // si esta logueado
          this.loginService.isAutenticated = true;
          this.router.navigate(['inicio']).then(r => '');
        } else {
          // error de logueo
          this.etiquetaWarning = true;
          this.mensajeAlerta = data.mensaje;
        }
        // this.nombre = data;
      }, ( errorServicio ) => {
        console.log('Error');
      }
    );
  }
}
