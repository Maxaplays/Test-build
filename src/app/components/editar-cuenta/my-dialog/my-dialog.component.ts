import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from 'src/app/services/login.service';
import { MustMatch } from './must-match.validator'

@Component({
  selector: 'app-my-dialog',
  templateUrl: './my-dialog.component.html',
  styleUrls: ['./my-dialog.component.css']
})
export class MyDialogComponent implements OnInit {
  usuario: string;
  FormularioContra: FormGroup 
  constructor(    
    public dialogRef: MatDialogRef<MyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) {

      this.usuario= localStorage.getItem('usuario');
      
      this.FormularioContra = this.formBuilder.group({
        contraActual: new FormControl('', Validators.required),
        nuevaContra: new FormControl('', Validators.required),
        nuevaContraValidada: new FormControl('', Validators.required)
    }, {
        validator: MustMatch('nuevaContra', 'nuevaContraValidada')
    });
     }

  ngOnInit() {

  }

  get f() { return this.FormularioContra.controls; }


  savePassword() {
    let contraActual = this.FormularioContra.controls['contraActual'].value
    this.loginService.changePassword(this.usuario,this.FormularioContra.controls['contraActual'].value,this.FormularioContra.controls['nuevaContra'].value).subscribe(
      (data: any) => {

         let a =data;
         this.dialogRef.close()

        this.snackBar.open(data,'',{
          duration:2000
        })
        
      }, ( errorServicio ) => {
        console.log("No se logro enviar la contraseña")
      }
    );
  }
}

/*    savePassword() {
    let contraActual = this.FormularioContra.controls['contraActual'].value
    this.loginService.getLogin(this.usuario,contraActual).subscribe(
      (data: any) => {
        if (data.error ===  null) {

          this.loginService.changePassword(this.usuario,this.FormularioContra.controls['contraActual'].value,this.FormularioContra.controls['nuevaContra'].value)
          this.dialogRef.close()
        } else {
          alert('Su contraseña actual no coincide')
        }
        
        
      }, ( errorServicio ) => {
        console.log("No se logro")
      }
    );
  }
  */