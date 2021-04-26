import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckRolesService {

  arrayRoles = [];

  constructor(private router: Router) { }

  public rolesArray(){
    this.arrayRoles = localStorage.getItem('rolesUsuario').split(',')
    console.log(this.arrayRoles)
    return this.arrayRoles
  }
  public navigateReturn(role: string){
    if(!this.arrayRoles.includes(role)){
      this.router.navigate(['/'])
    }
  }
}
