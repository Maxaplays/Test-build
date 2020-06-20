import { Component, OnInit } from '@angular/core';
import { FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-content-dashboard',
  templateUrl: './content-dashboard.component.html',
  styleUrls: ['./content-dashboard.component.css']
})
export class ContentDashboardComponent implements OnInit {
  // bkm
  ingresando: string;
  revision: string;
  finalizadas: string;
  // bkm

  constructor(private fabricaService: FabricaService) { }

  ngOnInit() {
    this.getConsultaDashboard();
  }
  getConsultaDashboard() {
    // console.log(localStorage.getItem('codigoSucursal'));
    this.fabricaService.getConsultaDashboard(localStorage.getItem('usuario')).pipe(map(data => data["CREDITO"])).subscribe(
      (data: any[]) => {
        console.log(data);
        this.ingresando = data[0].Ingresando;
        this.revision = data[0].Revision;
        this.finalizadas = data[0].Finalizadas;
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
}
