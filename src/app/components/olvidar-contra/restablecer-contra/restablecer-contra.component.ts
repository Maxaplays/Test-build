import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MustMatch } from './must-match.validator';

@Component({
  selector: 'app-restablecer-contra',
  templateUrl: './restablecer-contra.component.html',
  styleUrls: ['./restablecer-contra.component.css']
})
export class RestablecerContraComponent implements OnInit {
  @Input() passToken: string;
  FormularioContra: FormGroup 
  token = ''
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar

  ) {
    this.FormularioContra = this.formBuilder.group({
      nuevaContra: new FormControl('', Validators.required),
      nuevaContraValidada: new FormControl('', Validators.required)
  }, {
      validator: MustMatch('nuevaContra', 'nuevaContraValidada')
  })
  }

  ngOnInit() {
    this.token = location.pathname
    this.token = this.token.substr(this.token.lastIndexOf('/') + 1)
  }

  get f() { return this.FormularioContra.controls; }

  savePassword() {
    let nuevaContra = this.FormularioContra.controls['nuevaContra'].value
    this.loginService.restablecerContra(nuevaContra, this.token)
    this.router.navigate(['/'])
    this.snackBar.open("Su contraseña se ha restablecido correctamente",'',{
      duration:2000
    })
  }
}
