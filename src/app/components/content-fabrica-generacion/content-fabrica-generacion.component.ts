import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DocumentosService } from '../../services/documentos.service';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-content-fabrica-generacion',
  templateUrl: './content-fabrica-generacion.component.html',
  styleUrls: ['./content-fabrica-generacion.component.css']
})
export class ContentFabricaGeneracionComponent implements OnInit {

  NOMBRE_BANCO: string;
  TIPO_BANCO: string;
  closeResult: string;
  EntidadFinanciera: any[] = [];
  TipoCuenta: any[] = [];
  NumeroCuenta: any[] = [];
  constructor(private modalService: NgbModal, private documentosService: DocumentosService) {
    this.EntidadFinanciera = this.getEntidadFinanciera();
    this.TipoCuenta = this.getTipoCuenta();
    this.NumeroCuenta = this.getNumeroCuenta();
  }

  ngOnInit() {
  }

  openLg(content) {
    this.modalService.open(content);
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  getEntidadFinanciera(): any {
    this.documentosService.getEntidadFinanciera()
      .pipe(map (data => data["ENTI_FINA"]))
      .subscribe((data: any) => {
        this.EntidadFinanciera = data;
        console.log(this.EntidadFinanciera);
      });
  }

  getTipoCuenta(): any {
    if (this.NOMBRE_BANCO !== null || this.NOMBRE_BANCO !== undefined ) {
      this.documentosService.getTipoCuenta(this.NOMBRE_BANCO)
        .pipe(map (data => data["TIPO_CUENTA"]))
        .subscribe((data: any) => {
          this.TipoCuenta = data;
          console.log(this.TipoCuenta);
        });
    }
  }
  getNumeroCuenta(): any {
      this.documentosService.getNumeroCuenta(this.NOMBRE_BANCO, this.TIPO_BANCO)
        .pipe(map (data => data["NUMERO_CUENTA"]))
        .subscribe((data: any) => {
          this.NumeroCuenta = data;
          console.log(this.NumeroCuenta);
        });
  }
}

