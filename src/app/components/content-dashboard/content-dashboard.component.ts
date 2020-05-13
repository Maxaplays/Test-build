import { Component, OnInit } from '@angular/core';
import { FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';

@Component({
  selector: 'app-content-dashboard',
  templateUrl: './content-dashboard.component.html',
  styleUrls: ['./content-dashboard.component.css']
})
export class ContentDashboardComponent implements OnInit {
  // bkm
  estadosUsuario: any[];
  // bkm

  constructor(private fabricaService: FabricaService) { }

  ngOnInit() {
    this.getConsultaDashboard();
  }
  getConsultaDashboard() {
    // console.log(localStorage.getItem('codigoSucursal'));
    this.fabricaService.getConsultaDashboard(localStorage.getItem('usuario')).subscribe(
      (data: any) => {
        this.estadosUsuario = data;
        console.log(data);
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
}
