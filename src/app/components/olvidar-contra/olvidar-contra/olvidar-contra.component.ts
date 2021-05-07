import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-olvidar-contra',
  templateUrl: './olvidar-contra.component.html',
  styleUrls: ['./olvidar-contra.component.css']
})
export class OlvidarContraComponent implements OnInit {
  constructor(
    private loginServicio: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
  }

  enviar(email){
    let rex = new RegExp("[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^_`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
    console.log(email)
    if(rex.test(email)){
      this.loginServicio.resetearContra(email,location.origin)
      this.router.navigate(['/'])
      this.snackBar.open("Revise su mail",'',{
        duration:2000
      })
    }else{
      alert("Lo escrito no contiene formato de mail")
    }
  }
}
