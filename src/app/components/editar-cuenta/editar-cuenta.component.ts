import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MyDialogComponent } from './my-dialog/my-dialog.component';

@Component({
  selector: 'app-editar-cuenta',
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})
export class EditarCuentaComponent implements OnInit {

  usuario:string;
  emailUsuario:string;
  
  constructor(public dialog: MatDialog) { 
    this.usuario= localStorage.getItem('usuario');//nombre de usuario
    this.emailUsuario=localStorage.getItem('emailUsuario');//roles de usuario
  }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
    });
  }
}
