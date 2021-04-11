import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TarjetasTrelloService } from 'src/app/services/tarjetasTrello/tarjetas-trello.service';

@Component({
  selector: 'app-prioridad-config',
  templateUrl: './prioridad-config.component.html',
  styleUrls: ['./prioridad-config.component.css']
})
export class PrioridadConfigComponent implements OnInit {

  constructor(private tarjetaService: TarjetasTrelloService) { }
  aux1= new Date();
  aux2= new Date();
  FormularioFechaSprint: FormGroup;
  ngOnInit() {
    this.tarjetaService.login("Inicio",0)
    this.initForm()
    let fechaDesde: Date = new Date;
    let fechaHasta: Date = new Date ;
    let desde = fechaDesde.toISOString().substring(0, 10);
    let hasta = fechaHasta.toISOString().substring(0, 10);
    this.FormularioFechaSprint.controls['fechaDesde'].setValue(desde);
    this.FormularioFechaSprint.controls['fechaHasta'].setValue(hasta);
  }
  private initForm() {
    this.FormularioFechaSprint = new FormGroup({
      fechaDesde: new FormControl(null, Validators.required),
      fechaHasta: new FormControl(null, Validators.required),
    });
  }

  private Submit(){    
    let fechaDesde: string = this.FormularioFechaSprint.controls['fechaDesde'].value;
    let fechaHasta: string = this.FormularioFechaSprint.controls['fechaHasta'].value;
    this.tarjetaService.enviarDatosSprint([fechaDesde,fechaHasta])

  }
  async moverTarjetas(){
    this.tarjetaService.limpiar()
    await this.tarjetaService.moverTarjetasBacklog()
  }
  async regresarTarjetas(){
    this.tarjetaService.limpiar()
    await this.tarjetaService.regresarTarjetas()
    
  }
  llamarDatos(){
    this.tarjetaService.getDatosSprint().then(datos=>{
      datos.Datos.forEach(element => {
        console.log(new Date(element.fechaFin))
        console.log(new Date(element.fechaInicio))     
      });
    })
  }
  llamarArea(){
    this.tarjetaService.obtenerAreasTrello().then(datos=>{
      datos.Datos.forEach(element => {
        console.log(element.Nombre_Area)        
      });
    })
  }

}
