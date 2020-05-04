import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-content-fabrica-credito',
  templateUrl: './content-fabrica-credito.component.html',
  styleUrls: ['./content-fabrica-credito.component.css']
})
export class ContentFabricaCreditoComponent implements OnInit {

  closeResult: string;

  // bkm
  mensajeServicio: DatosFabrica;
  FormularioDatosBasicos: FormGroup; // formulario de react driven del HTML
  // bkm

  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              @Inject(LOCALE_ID) private locale: string) {

  }

  ngOnInit() {
    this.initForm(); // inicializar la forma de la pantalla de ReactDriven
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        this.InicilizarValores();
        // console.log(data);
      });
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  enviarNuevoMensaje(){
    this.fabricaService.changeMessage(new DatosFabrica());
  }
  // bkm
  InicilizarValores(){
    this.FormularioDatosBasicos.controls['aplicadoPerfil'].setValue(this.mensajeServicio.PerfilAplicado);
    this.FormularioDatosBasicos.controls['aplicadoMontoVenta'].setValue(this.mensajeServicio.Monto);
    this.FormularioDatosBasicos.controls['aplicadoVentaTotal'].setValue(this.mensajeServicio.ValorTotal);
    this.FormularioDatosBasicos.controls['aplicadoPorcentajeEntrada'].setValue(this.mensajeServicio.PorcentajeEntradaAplicada);
    this.FormularioDatosBasicos.controls['aplicadoEntrada'].setValue(this.mensajeServicio.EntradaAplicada);
    this.FormularioDatosBasicos.controls['aplicadoMontoReferencial'].setValue(this.mensajeServicio.MontoSugerido);
    this.FormularioDatosBasicos.controls['aplicadoTasa'].setValue(this.mensajeServicio.Tasa);
    this.FormularioDatosBasicos.controls['wsPerfilSugerido'].setValue(this.mensajeServicio.Perfil);
    this.FormularioDatosBasicos.controls['wsVentaMaxima'].setValue(this.mensajeServicio.ventaMaxSugerida);
    this.FormularioDatosBasicos.controls['wsPorcentajeEntrada'].setValue(this.mensajeServicio.PorcentajeEntradaSugerida);
    this.FormularioDatosBasicos.controls['wsEntradaSugerida'].setValue(this.mensajeServicio.EntradaSugerida);
    this.FormularioDatosBasicos.controls['wsCreditoSugerido'].setValue(this.mensajeServicio.MontoSugerido);
    this.FormularioDatosBasicos.controls['wsProducto'].setValue("");
    this.FormularioDatosBasicos.controls['wsCapacidadPagoMax'].setValue(this.mensajeServicio.CapacidadPagoSugerida);
    this.FormularioDatosBasicos.controls['ventaSolicitada'].setValue(this.mensajeServicio.VentaCabecera);
    this.FormularioDatosBasicos.controls['ventaTotal'].setValue(this.mensajeServicio.VentaCabecera);
    this.FormularioDatosBasicos.controls['porcentajeEntrada'].setValue(this.mensajeServicio.PorcentajeEntrada);
    this.FormularioDatosBasicos.controls['entrada'].setValue(this.mensajeServicio.Entrada);
    this.FormularioDatosBasicos.controls['montoCredito'].setValue(this.mensajeServicio.MontosAplicados);
    this.FormularioDatosBasicos.controls['plazo'].setValue(this.mensajeServicio.Plazo);
    this.FormularioDatosBasicos.controls['cuotaMensualFija'].setValue(this.mensajeServicio.CuotaFija);
  }
  onIngresosChange() {
    let entrada: number = this.FormularioDatosBasicos.controls['entrada'].value;
    let Total: number = this.FormularioDatosBasicos.controls['ventaTotal'].value;
    let plazos: number = this.FormularioDatosBasicos.controls['plazo'].value;
    let tasa: number = this.FormularioDatosBasicos.controls['aplicadoTasa'].value;
    let diferencia : number = Total - entrada;
    let formattedNumber = formatNumber(diferencia, this.locale, '.2-2');
    let porcentajeEntrada: number = (entrada / Total)* 100;
    let porcentajeEntradaDecimal = formatNumber(porcentajeEntrada, this.locale, '.2-2');
    this.FormularioDatosBasicos.controls['montoCredito'].setValue(formattedNumber);
    this.FormularioDatosBasicos.controls['porcentajeEntrada'].setValue(porcentajeEntradaDecimal);
    let cuotaMensual = this.calcularCuotaFija(diferencia, plazos, tasa, entrada);
    let cuotaMensualDecimal = formatNumber(cuotaMensual, this.locale, '.2-2');
    this.FormularioDatosBasicos.controls['cuotaMensualFija'].setValue(cuotaMensualDecimal);
  }
  calcularCuotaFija(Monto: number, Plazos: number, tasa: number, anticipo: number): number {
    let Cuota_F: number = 0;
    try {
      if (tasa <= 0){
        try{
          Cuota_F = (Monto - anticipo) / Plazos;
        }
        catch (error)
        {
          return 0;
        }
      } else {
        // tasa enviada desde la pantalla
        tasa = tasa / 100;
        // Formula de cálculo de la cuota fija en base al monto, plazo y tasa actual del mercado
        Cuota_F = Monto * (((tasa / 12) * (Math.pow(1 + (tasa / 12), Plazos))) / ((Math.pow(1 + (tasa / 12), Plazos)) - 1));
      }
      return Cuota_F;
    } catch (error) {
      return Cuota_F;
    }
  }
  private initForm() {
    this.FormularioDatosBasicos = new FormGroup({
      aplicadoPerfil: new FormControl({value: '0', disabled: true}),
      aplicadoMontoVenta: new FormControl({ value: '0', disabled: true}),
      aplicadoVentaTotal: new FormControl({ value: '0', disabled: true}),
      aplicadoPorcentajeEntrada: new FormControl({ value: '0', disabled: true}),
      aplicadoEntrada: new FormControl({ value: '0', disabled: true}),
      aplicadoMontoReferencial: new FormControl({ value: '0', disabled: true}),
      aplicadoTasa: new FormControl({ value: '15', disabled: true}),
      wsPerfilSugerido: new FormControl({value: '0', disabled: true}),
      wsVentaMaxima: new FormControl({ value: '0', disabled: true}),
      wsPorcentajeEntrada: new FormControl({ value: '0', disabled: true}),
      wsEntradaSugerida: new FormControl({ value: '0', disabled: true}),
      wsCreditoSugerido: new FormControl({ value: '0', disabled: true}, Validators.required),
      wsProducto: new FormControl({ value: '0', disabled: true}, Validators.required),
      wsCapacidadPagoMax: new FormControl({ value: '0', disabled: true}),
      ventaSolicitada: new FormControl({ value: '0', disabled: true}, Validators.required),
      ventaTotal: new FormControl(null, Validators.required),
      porcentajeEntrada: new FormControl({ value: '0', disabled: true}, Validators.required),
      entrada: new FormControl(null, Validators.required),
      montoCredito: new FormControl({ value: '0', disabled: true}, Validators.required),
      plazo: new FormControl(null, Validators.required),
      cuotaMensualFija: new FormControl({ value: '0', disabled: true}, Validators.required)
    });
  }
  // bkm
}
