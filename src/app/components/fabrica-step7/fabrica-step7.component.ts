import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckRolesService } from 'src/app/services/checkRoles/check-roles.service';

@Component({
  selector: 'app-fabrica-step7',
  templateUrl: './fabrica-step7.component.html',
  styleUrls: ['./fabrica-step7.component.css']
})
export class FabricaStep7Component implements OnInit {
  public idCre: string = 'Defecto';
  private sub: any;

  constructor(private route: ActivatedRoute, private checkRoles: CheckRolesService) {
  }

 ngOnInit() {
   this.checkRoles.navigateReturn("Membership FabricaCredito Ventas Ingresos")
   this.sub = this.route.params.subscribe(params => {
     this.idCre = params['idCre']; // (+) converts string 'id' to a number
     // console.log('Credito Steps:' + this.idCre);
     // In a real app: dispatch action to load the details here.
  });
 }

}
