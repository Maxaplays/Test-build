import {Component, Input, OnInit} from '@angular/core';
import {Historial, HistorialService} from '../../services/historial/historial.service';
import {map} from 'rxjs/operators';
import {DatosFabrica, FabricaService} from '../../services/fabricaCredito/fabrica.service';

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

  constructor( private historialService: HistorialService,
               private fabricaService: FabricaService ) { }

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

  public getHistorial(): any {
    this.historialService.getHistorial(this.idCredito)
      .pipe(map(data => data['HISTORIAL']))
      .subscribe((data: any) => {
        this.historial = data;
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
          this.getHistorial();
          this.comentario = '';
        });
    }
  }
}
