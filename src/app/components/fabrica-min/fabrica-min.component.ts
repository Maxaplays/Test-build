import { Component, OnInit } from '@angular/core';
import { CheckRolesService } from 'src/app/services/checkRoles/check-roles.service';

@Component({
  selector: 'app-fabrica-min',
  templateUrl: './fabrica-min.component.html',
  styleUrls: ['./fabrica-min.component.css']
})
export class FabricaMinComponent implements OnInit {

  constructor(private checkRoles: CheckRolesService) { }

  ngOnInit() {
    this.checkRoles.navigateReturn("Membership FabricaCredito Ventas Ingresos")
  }


}
