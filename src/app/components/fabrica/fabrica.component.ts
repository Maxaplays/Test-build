import { Component, OnInit } from '@angular/core';
import { CheckRolesService } from 'src/app/services/checkRoles/check-roles.service';

@Component({
  selector: 'app-fabrica',
  templateUrl: './fabrica.component.html',
  styleUrls: ['./fabrica.component.css']
})
export class FabricaComponent implements OnInit {

  constructor(private checkRoles: CheckRolesService) { }

  ngOnInit() {
    this.checkRoles.navigateReturn("Membership FabricaCredito Ventas Ingresos")
  }

}
