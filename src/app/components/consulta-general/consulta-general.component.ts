import { Component, OnInit } from '@angular/core';
import { CheckRolesService } from 'src/app/services/checkRoles/check-roles.service';

@Component({
  selector: 'app-consulta-general',
  templateUrl: './consulta-general.component.html',
  styleUrls: ['./consulta-general.component.css']
})
export class ConsultaGeneralComponent implements OnInit {

  constructor(private checkRoles: CheckRolesService) { }

  ngOnInit() {
    this.checkRoles.navigateReturn("Membership FabricaCredito Consultas")
  }

}
