import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DireccionesService} from '../../services/direcciones/direcciones.service';
import {TelefonosService} from '../../services/telefonos/telefonos.service';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-content-fabrica-solicitud-credito',
  templateUrl: './content-fabrica-solicitud-credito.component.html',
  styleUrls: ['./content-fabrica-solicitud-credito.component.css']
})
export class ContentFabricaSolicitudCreditoComponent implements OnInit {
  closeResult: string;

  // variables para presentacion
  tipoDir: any[] = [];
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];
  barrios: any[] = [];
  tipoTel: any[] = [];
  telefonos: any[] = [];
  tipoRegTel: any[] = ['CLIENTE', 'CONYUGUE'];

  // variables para API
  COD_PROV: string;
  COD_CAN: string;
  COD_PAR: string;
  ID_CLI =  '1716822679';

  // tslint:disable-next-line:max-line-length
  constructor(private modalService: NgbModal, private tipoDireccionesService: DireccionesService, private tipoTelefonoServive: TelefonosService) {
    this.tipoDir = this.getTipoDir();
    this.provincias = this.getProvincia();
    this.cantones = this.getCanton();
    this.barrios = this.getBarrio();
    this.tipoTel = this.getTipoTel();
    this.telefonos = this.getTelefonos();
  }

  ngOnInit() {
  }

  openLg(content) {
    this.modalService.open(content);
  }

  openCustomWidth(content) {
    this.modalService.open(content, {windowClass: 'custom-width-modal'});
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  getTipoDir(): any {
    this.tipoDireccionesService.getTipoDir()
      .pipe(map (data => data["TIPODIR"]))
      .subscribe((data: any) => {
        this.tipoDir = data;
        console.log(this.tipoDir);
      });
  }

  getProvincia(): any {
    this.tipoDireccionesService.getProvincia()
      .pipe(map (data => data["PROVINCIA"]))
      .subscribe((data: any) => {
        this.provincias = data;
        console.log(this.provincias);
      });
  }

  getCanton(): any {
    if (this.COD_PROV !== undefined) {
      this.tipoDireccionesService.getCanton(this.COD_PROV)
        .pipe(map(data => data["CANTON"]))
        .subscribe((data: any) => {
          this.cantones = data;
          console.log(this.cantones);
        });
    }
  }

  getParroquia(): any {

    if (this.COD_CAN !== undefined) {
      this.tipoDireccionesService.getParroquia(this.COD_CAN)
        .pipe(map(data=> data["PARROQUIA"]))
        .subscribe((data: any) => {
          this.parroquias = data;
          console.log(this.parroquias);
        });
    }
  }

  getBarrio(): any {
    if (this.COD_PAR !== undefined) {
      this.tipoDireccionesService.getBarrio(this.COD_PAR)
        .pipe(map(data=> data["BARRIO"]))
        .subscribe((data: any) => {
          this.barrios = data;
          console.log(this.barrios);
        });
    }
  }

  getTipoTel(): any {
    this.tipoTelefonoServive.getTipoTelefonos()
      .pipe(map(data => data["TIPTEL"]))
      .subscribe((data: any) => {
        this.tipoTel = data;
      });
  }

  getTelefonos(): any {
    this.tipoTelefonoServive.getTelefonos(this.ID_CLI)
      .pipe(map(data => data["TELEFONOS"]))
      .subscribe((data: any) => {
        this.telefonos = data;
      });
  }

}

