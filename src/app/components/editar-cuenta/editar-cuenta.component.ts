import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-cuenta',
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})
export class EditarCuentaComponent implements OnInit {

  usuario:string;
  emailUsuario:string;
  
  constructor() { 
    this.usuario= localStorage.getItem('usuario');//nombre de usuario
    this.emailUsuario=localStorage.getItem('emailUsuario');//roles de usuario
  }

  ngOnInit() {
  }

}
