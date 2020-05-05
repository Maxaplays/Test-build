import { Component, OnInit, Input, TemplateRef, ViewChild, Inject, LOCALE_ID  } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValoresSimulador } from '../../services/fabricaCredito/fabrica.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
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
  mensajeValidacion: string;
  listadoErrores: string[];
  // bkm

  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              private router: Router,
              @Inject(LOCALE_ID) private locale: string) {

  }

  ngOnInit() {
    this.initForm(); // inicializar la forma de la pantalla de ReactDriven
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        this.InicilizarValores();
        // console.log(data.replace(',','.'));
      });
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  enviarNuevoMensaje() {
    this.fabricaService.changeMessage(new DatosFabrica());
  }
  // bkm
  InicilizarValores() {
    this.FormularioDatosBasicos.controls['aplicadoPerfil'].setValue(this.mensajeServicio.PerfilAplicado.replace(',', '.'));
    this.FormularioDatosBasicos.controls['aplicadoMontoVenta'].setValue(this.mensajeServicio.Monto.replace(',', '.'));
    this.FormularioDatosBasicos.controls['aplicadoVentaTotal'].setValue(this.mensajeServicio.ValorTotal.replace(',', '.'));
    this.FormularioDatosBasicos.controls['aplicadoPorcentajeEntrada'].setValue(this.mensajeServicio.PorcentajeEntradaAplicada.replace(',', '.'));
    this.FormularioDatosBasicos.controls['aplicadoEntrada'].setValue(this.mensajeServicio.EntradaAplicada.replace(',', '.'));
    this.FormularioDatosBasicos.controls['aplicadoMontoReferencial'].setValue(this.mensajeServicio.MontoSugerido.replace(',', '.'));
    this.FormularioDatosBasicos.controls['aplicadoTasa'].setValue(this.mensajeServicio.Tasa.replace(',', '.'));
    this.FormularioDatosBasicos.controls['wsPerfilSugerido'].setValue(this.mensajeServicio.Perfil.replace(',', '.'));
    this.FormularioDatosBasicos.controls['wsPorcentajeEntrada'].setValue(this.mensajeServicio.PorcentajeEntradaSugerida.replace(',', '.'));
    
    try {
      let wsCreditoSugerido: number = Number.parseFloat(this.mensajeServicio.MontoSugerido.replace(',', '.'));
      let wsPorcengajeEntradaSugerida: number = Number.parseFloat(this.mensajeServicio.PorcentajeEntradaSugerida.replace(',', '.'));
      let wsEntrada: number = wsCreditoSugerido * (wsPorcengajeEntradaSugerida / 100);
      this.FormularioDatosBasicos.controls['wsEntradaSugerida'].setValue(wsEntrada.toString().replace(',', '.'));
      let wsVentaTotal: number = wsCreditoSugerido / (1 - (wsPorcengajeEntradaSugerida / 100));
      this.FormularioDatosBasicos.controls['wsVentaMaxima'].setValue(wsVentaTotal.toString().replace(',', '.'));
    } catch (error) {
      
    } 
    this.FormularioDatosBasicos.controls['wsCreditoSugerido'].setValue(this.mensajeServicio.MontoSugerido.replace(',', '.'));
    this.FormularioDatosBasicos.controls['wsProducto'].setValue(this.mensajeServicio.idProducto);
    this.FormularioDatosBasicos.controls['wsCapacidadPagoMax'].setValue(this.mensajeServicio.CapacidadPagoSugerida.replace(',', '.'));
    this.FormularioDatosBasicos.controls['ventaSolicitada'].setValue(this.mensajeServicio.ValorTotal.replace(',', '.'));
    this.FormularioDatosBasicos.controls['ventaTotal'].setValue(this.mensajeServicio.ValorTotal.replace(',', '.'));
    this.FormularioDatosBasicos.controls['porcentajeEntrada'].setValue(this.mensajeServicio.PorcentajeEntradaSugerida.replace(',', '.'));
    this.FormularioDatosBasicos.controls['entrada'].setValue(this.mensajeServicio.Entrada.replace(',', '.'));
    this.FormularioDatosBasicos.controls['montoCredito'].setValue(this.mensajeServicio.Monto.replace(',', '.'));
    this.FormularioDatosBasicos.controls['plazo'].setValue(this.mensajeServicio.Plazo.replace(',', '.'));
    this.FormularioDatosBasicos.controls['cuotaMensualFija'].setValue(this.mensajeServicio.CuotaFija.replace(',', '.'));
  }
  onIngresosChange() {
    let entrada: number = this.FormularioDatosBasicos.controls['entrada'].value;
    let Total: number = this.FormularioDatosBasicos.controls['ventaTotal'].value;
    let plazos: number = this.FormularioDatosBasicos.controls['plazo'].value;
    let tasa: number = this.FormularioDatosBasicos.controls['aplicadoTasa'].value;
    let diferencia : number = Total - entrada;
    let formattedNumber = formatNumber(diferencia, this.locale, '.2-2');
    let porcentajeEntrada: number = (entrada / Total) * 100;
    let porcentajeEntradaDecimal = formatNumber(porcentajeEntrada, this.locale, '.2-2');
    this.FormularioDatosBasicos.controls['montoCredito'].setValue(formatNumber(Total, this.locale, '.2-2'));
    this.FormularioDatosBasicos.controls['porcentajeEntrada'].setValue(porcentajeEntradaDecimal);
    let cuotaMensual = this.calcularCuotaFija(diferencia, plazos, tasa, entrada);
    let cuotaMensualDecimal = formatNumber(cuotaMensual, this.locale, '.2-2');
    this.FormularioDatosBasicos.controls['cuotaMensualFija'].setValue(cuotaMensualDecimal);
    // this.mensajeServicio.PorcentajeEntrada = porcentajeEntrada.toString();
    // this.mensajeServicio.CuotaMensual = this.calcularCuotaFija(diferencia, plazos, tasa, entrada).toString();
    // this.mensajeServicio.Monto = diferencia.toString();
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
  ValidarFormularioDatosBasicos(content: any, tipo: string) {
    if (this.FormularioDatosBasicos.valid) {
      // console.log('Inicio Proceso...' + this.FormularioDatosBasicos.status);
      let valoresSimulador: ValoresSimulador = new ValoresSimulador();
      valoresSimulador.tipoValidacion = tipo;
      valoresSimulador.idCredito = this.mensajeServicio.NumeroCredito;
      valoresSimulador.lblSucursal = this.mensajeServicio.idSucursal;
      valoresSimulador.seMonto = this.FormularioDatosBasicos.controls['montoCredito'].value;
      valoresSimulador.lblPerfilCliente = this.FormularioDatosBasicos.controls['wsPerfilSugerido'].value;
      valoresSimulador.cmbProducto = this.FormularioDatosBasicos.controls['wsProducto'].value;
      valoresSimulador.lblSucursal = localStorage.getItem('codigoSucursal');
      valoresSimulador.seVentaTotalAplicada = this.FormularioDatosBasicos.controls['ventaTotal'].value;
      valoresSimulador.seMontoSugerido = this.FormularioDatosBasicos.controls['wsCreditoSugerido'].value;
      valoresSimulador.seEntrada = this.FormularioDatosBasicos.controls['entrada'].value;
      valoresSimulador.seValorTotal = this.FormularioDatosBasicos.controls['ventaTotal'].value;
      valoresSimulador.sePlazo = this.FormularioDatosBasicos.controls['plazo'].value;
      valoresSimulador.seTasa = this.FormularioDatosBasicos.controls['aplicadoTasa'].value;
      valoresSimulador.lblPlazoSugerido = this.FormularioDatosBasicos.controls['plazo'].value;
      valoresSimulador.relacionLaboral = '';
      valoresSimulador.seCuotaFija = this.FormularioDatosBasicos.controls['cuotaMensualFija'].value;
      valoresSimulador.TipoId = '';
      valoresSimulador.PerfilAplicado = this.FormularioDatosBasicos.controls['aplicadoPerfil'].value;
      valoresSimulador.MontoAprobado = this.FormularioDatosBasicos.controls['wsVentaMaxima'].value;
      valoresSimulador.usuario = localStorage.getItem("usuario");
      valoresSimulador.ruc = this.mensajeServicio.Cedula;
      valoresSimulador.entradaAplicada = this.FormularioDatosBasicos.controls['entrada'].value;;
      valoresSimulador.capacidadPagoSugerida = Number(this.mensajeServicio.CapacidadPagoSugerida.toString().replace(',', '.'));
      valoresSimulador.EstadoCivil = '';
      valoresSimulador.IngresoValidado = this.mensajeServicio.IngresoValidado;
      valoresSimulador.BaseUrl = '';
      valoresSimulador.nombreConsultado = this.mensajeServicio.NombreConsultado;
      valoresSimulador.fechaNacimiento = this.mensajeServicio.FechaNacimiento;

      this.fabricaService.getcalcularValoresSimulador(valoresSimulador).subscribe(
        (data: any) => {
          // this.datosGenerales = data;
          console.log('Data Recibida WS:');
          console.log(data);
          this.FormularioDatosBasicos.controls['aplicadoPerfil'].setValue(data.lblPerfilAplicado);
          let montoCredito: number = data.seMontoAprobado;
          let entrada: number = data.seEntradaAplicada;
          let VentaTotal: number = montoCredito + entrada;
          this.FormularioDatosBasicos.controls['aplicadoMontoVenta'].setValue(data.seMontoAprobado.toString().replace(',', '.'));
          this.FormularioDatosBasicos.controls['aplicadoVentaTotal'].setValue(VentaTotal.toString().replace(',', '.'));
          this.FormularioDatosBasicos.controls['aplicadoPorcentajeEntrada'].setValue(data.sePorcentajeEntrada.toString().replace(',', '.'));
          this.FormularioDatosBasicos.controls['aplicadoEntrada'].setValue(data.seEntradaAplicada.toString().replace(',', '.'));
          this.FormularioDatosBasicos.controls['aplicadoMontoReferencial'].setValue(data.lblventaMaxSugerida.toString().replace(',', '.'));
          this.listadoErrores = data.listaErrores;
          if (tipo === 'Validar') {
            if (this.listadoErrores.length > 0) {

              this.mensajeValidacion = 'Errores detectados:';
              this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
            } else {
              // Sin errores seguir con siguiente paso
              this.mensajeValidacion = 'Validación Correcta!';
              this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
            } 
          }
          if (tipo === 'Continuar') {
            if (this.listadoErrores.length > 0) {
              this.mensajeValidacion = 'Errores detectados:';
              this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
            } else {
              // Sin errores seguir con siguiente paso
              this.router.navigate(['/fabrica/nueva-solicitud/solicitud-credito']);
            } 
          }
          // this.router.navigate(['/fabrica/nueva-solicitud/credito']);
        }, ( errorServicio ) => {
          // console.log('Error');
        }
      );
    } else {
      console.log('Formulario Inválido...' + this.FormularioDatosBasicos.status);
    }
  }
  // bkm
}
