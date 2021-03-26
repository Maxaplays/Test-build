import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Historial, HistorialService } from '../../services/historial/historial.service';
import { map } from 'rxjs/operators';
import { DatosFabrica, FabricaService } from '../../services/fabricaCredito/fabrica.service';

@Component({
  selector: 'app-modal-historial',
  templateUrl: './modal-historial.component.html',
  styleUrls: ['./modal-historial.component.css']
})
export class ModalHistorialComponent implements OnInit {

  idCredito: string;
  mensajeServicio: DatosFabrica;
  estado: string;
  diasEstado: number;
  subEstado: string;
  diasSubEstado: number;
  comentario;
  historial: any[] = [];
  aux:boolean = true;

  constructor(private historialService: HistorialService,
    private fabricaService: FabricaService) { }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        this.idCredito = this.mensajeServicio.Condicion;
      });
    this.getEstado();
    this.getHistorial();
  }

  public getEstado(): any {
    this.historialService.getEstadoSubEstado(this.idCredito)
      .pipe(map(data => data['ESTADO']))
      .subscribe((data: any) => {
        this.estado = data[0].ESTADO;
        this.diasEstado = data[0].DIASESTADO;
        this.subEstado = data[0].SUBESTADO;
        this.diasSubEstado = data[0].DIASSUBESTADO;
      });
  }

  @HostListener("scroll", ['$event'])
  public cargarDatos(event) {
    let pos = event.srcElement.scrollTop;
    let max = event.srcElement.scrollHeight-event.srcElement.offsetHeight;
    if (pos == max) {
      this.agregarDatos();
    }
  }
  public agregarDatos(){
    if(this.aux){
      this.historialService.getHistorial(this.idCredito,this.historial[this.historial.length-1]["ID_HIST"])
      .pipe(map(data => data['HISTORIAL']))
      .subscribe((data: any) => {
        data.forEach(element => {
          this.historial.push(element)          
        });
        if(data.length<5){
          this.aux=false
        }
      });
    }
       
  }
  public getHistorial(): any {    
    this.historialService.getHistorial(this.idCredito,"x")
      .pipe(map(data => data['HISTORIAL']))
      .subscribe((data: any) => {
        this.historial = data;
        if(data.length<5){
          this.aux=false
        }
      });
  }

  public postHistorial() {
    if (this.comentario !== '' && this.comentario !== 'undefined') {
      const comentario: Historial = new Historial();
      comentario.ID_CRE = this.idCredito;
      comentario.DES_HIST = this.comentario;
      comentario.USR_HIST = localStorage.getItem('usuario');

      this.historialService.postComentario(comentario).subscribe(
        (data: any) => {
          this.aux=true;
          this.getHistorial();
          this.comentario = '';
        });
    }
  }
}
