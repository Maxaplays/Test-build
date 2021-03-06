import { Component, OnInit } from '@angular/core';
import { FabricaService } from '../../services/fabricaCredito/fabrica.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {ExportService} from '../../services/exportar/export.service';

@Component({
  selector: 'app-content-consulta-general',
  templateUrl: './content-consulta-general.component.html',
  styleUrls: ['./content-consulta-general.component.css']
})
export class ContentConsultaGeneralComponent implements OnInit {
  // bkm
  checked = false;
  creditos: any[];
  cantidadCreditos: number;
  searchText: string;
  loading: boolean;
  FormularioDatosBasicos: FormGroup; // formulario de react driven del HTML
  pageActual: number = 1;

  // bkm
  constructor(private fabricaService: FabricaService,
              private exportService: ExportService) {

   }

  ngOnInit() {
    this.initForm();
    let fechaDesde: Date = this.addDays(new Date(), -30);
    let fechaHasta: Date = this.addDays(new Date(), 0);
    this.cantidadCreditos = 0;
    let desde = fechaDesde.toISOString().substring(0, 10);
    let hasta = fechaHasta.toISOString().substring(0, 10);
    this.FormularioDatosBasicos.controls['fechaDesde'].setValue(desde);
    this.FormularioDatosBasicos.controls['fechaHasta'].setValue(hasta);
    this.FormularioDatosBasicos.controls['filtro'].setValue(this.checked);

    this.getCreditos();
  }
  private initForm() {
    this.FormularioDatosBasicos = new FormGroup({
      fechaDesde: new FormControl(null, Validators.required),
      fechaHasta: new FormControl(null, Validators.required),
      filtro: new FormControl(null)
    });
  }
  addDays(date: Date, days: number): Date {
    var dias = days;
    date.setDate(date.getDate() + dias);
    return date;
  }
  public getCreditos(): any {
    // console.log(fechaDesde + fechaHasta);
    this.loading = true;
    let fechaDesde: string = this.FormularioDatosBasicos.controls['fechaDesde'].value;
    let fechaHasta: string = this.FormularioDatosBasicos.controls['fechaHasta'].value;
    let filtro: string = this.FormularioDatosBasicos.controls['filtro'].value;

    console.log(filtro);
    this.fabricaService.getConsultaGeneral(localStorage.getItem('usuario'), fechaDesde, fechaHasta, filtro).subscribe((data: any) => {
      this.creditos = data.GENERO;
      this.cantidadCreditos = this.creditos.length;
      this.loading = false;
      // console.log(this.creditos);

    }, ( errorServicio ) => {
      // console.log('Error');
      this.loading = false;
    }
  );
  }

  Buscar(busqueda: string, parametro: string) {
    if (busqueda !== '') {
      this.creditos = this.creditos.filter(res => {
         return res[parametro].toLocaleLowerCase().match(busqueda.toLocaleLowerCase());
      });
    } else if (busqueda === '') {
      this.getCreditos();
    }
  }
  exportar() {
    this.exportService.exportToExcel(this.creditos, 'Creditos');
  }
}
