import { Component, OnInit, Input, TemplateRef, ViewChild, Inject, LOCALE_ID, ElementRef  } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FabricaService, DatosFabrica } from 'src/app/services/fabricaCredito/fabrica.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValoresSimulador } from '../../services/fabricaCredito/fabrica.service';
import { map, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { formatNumber } from '@angular/common';
import { Subject } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

@Component({
  selector: 'app-content-fabrica-credito-min',
  templateUrl: './content-fabrica-credito-min.component.html',
  styleUrls: ['./content-fabrica-credito-min.component.css']
})
export class ContentFabricaCreditoMinComponent implements OnInit {

  closeResult: string;
  private _error = new Subject<string>();
  private _success = new Subject<string>();
  // bkm
  @Input() idCre: string;
  mensajeServicio: DatosFabrica;
  FormularioDatosBasicos: FormGroup; // formulario de react driven del HTML
  mensajeValidacion: string;
  listadoErrores: string[];
  staticAlertClosed = false;
  errorMessage: string;
  successMessage: string;
  loading: boolean;
  tasaActual: number = 0;
  wsProducto: string;
  gestionCreditoSinIva: string = '';
  gestionDocumentalSinIva: string = '';
  gestionCreditoYGestionDocumentalSinIva: string = '';
  gestionCreditoYGestionDocumentalConIva: string = '';
  idCredito: string;
  entradaMinimaAplicada: string;
  entradaMinimaAplicadaPorcentaje: number;
  sliderMinimo: number=0;
  sliderMaximo: number=0;
  sliderValor: number=0;
  ventaMaximaLimiteMatriz: number=0;
  CreditoMaximoLimiteMatriz: number=0;
  entradaLimiteMatriz: number=0;
  rangosSlider: RangosSlider[];
  mensajeMontoSuperior: string;
  mensajeCuotaMensualSuperior: string;
  indexRecalculo: number = 0;
  indexRecalculoEntrada: number = 0;
  indexRecalculoEntradaSecuencial: number = 0;
  indexRecalculoCredito: number = 0;

  @ViewChild('mensajeModalError', null) public mydiv: ElementRef;
  indexRecalculoGestionCreditoSinIva: string;
  indexRecalculoGestionCreditoYGestionDocumentalSinIva: string;
  indexRecalculovalorTotalFactura: number;
  // bkm

  constructor(private modalService: NgbModal,
              private fabricaService: FabricaService,
              private router: Router,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.initForm(); // inicializar la forma de la pantalla de ReactDriven
    if (this.idCre !== undefined && this.idCre !== '') {
      this.idCredito = this.idCre;
      // console.log('Solicitud de credito:' + this.idCredito);
      if (typeof this.idCredito !== 'undefined') {
            this.fabricaService.getRetomarCredito(this.idCredito,
              localStorage.getItem('usuario')).pipe(map (data => data['Table1'][0])).subscribe(
                (data: DatosFabrica) => {
                  // console.log(data);
                  this.fabricaService.changeMessage(data);
                  this.mensajeServicio = data;
                  this.InicilizarValoresRecargarConsulta();
                  this.ValidarFormularioDatosBasicos(this.mydiv, 'Inicial');
                  // console.log('Acoplar Pantalla: ' + data.Estado);
                  // this.acoplarPantalla(data.Estado);
                });
      }
    } else {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        this.InicilizarValoresRecargarConsulta();
        // console.log(data);
      });
    }
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
  openCustomWidth(content) {
    this.modalService.open(content, {windowClass: 'custom-width-modal'});
  }

  enviarNuevoMensaje() {
    this.fabricaService.changeMessage(new DatosFabrica());
  }
  // bkm
  InicilizarValoresRecargarConsulta() {
    if (this.mensajeServicio.CapacidadPagoSugerida !== '') {
      // console.log(this.mensajeServicio);
      try {
        this.FormularioDatosBasicos.controls['wsCapacidadPagoMax'].setValue(this.mensajeServicio.CapacidadPagoSugerida.replace(',', '.'));
        let ventaTotal = 0;
        if (Number(this.mensajeServicio.CapacidadPagoSugerida.replace(',', '.')) <= 0) {
          ventaTotal = 0;
          this.FormularioDatosBasicos.controls['ventaTotal'].setValue('0');
        } else {
          ventaTotal = Number(this.mensajeServicio.ValorTotal.replace(',', '.'));
          this.FormularioDatosBasicos.controls['ventaTotal'].setValue(this.mensajeServicio.ValorTotal.replace(',', '.'));
        }
        this.FormularioDatosBasicos.controls['wsCreditoSugerido'].setValue(this.mensajeServicio.MontoSugerido.replace(',', '.'));
        this.FormularioDatosBasicos.controls['entrada'].setValue(this.mensajeServicio.Entrada.replace(',', '.'));
        this.FormularioDatosBasicos.controls['plazo'].setValue(this.mensajeServicio.Plazo.replace(',', '.'));
        try { this.ventaMaximaLimiteMatriz = Number(this.mensajeServicio.ventaMaximaLimiteMatriz.replace(',', '.')); } catch (error) { }
        try { this.CreditoMaximoLimiteMatriz = Number(this.mensajeServicio.CreditoMaximoLimiteMatriz.replace(',', '.')); } catch (error) { }
        try { this.entradaLimiteMatriz = Number(this.mensajeServicio.entradaLimiteMatriz.replace(',', '.')); } catch (error) { }
        
        // this.entradaMinimaAplicadaPorcentaje = this.mensajeServicio.PorcentajeEntradaAplicada.toString();
        this.wsProducto = this.mensajeServicio.idProducto;
        try {
          let variableRangos = this.mensajeServicio.RangosEntradasMaximos.toString().split('|');
          this.rangosSlider = new Array();
          let i = 0;
          for (i = 0; i < variableRangos.length - 1; i++) {
            let rango: RangosSlider = new RangosSlider();
            let variableDatos = variableRangos[i].toString().split(';');
            rango.entrada = Number(variableDatos[0].toString().replace(',', '.').replace('%',''));
            rango.perfil = Number(variableDatos[1].toString().replace(',', '.'));
            rango.montoMinimo = Number(variableDatos[2].toString().replace(',', '.'));
            rango.montoMaximo = Number(variableDatos[3].toString().replace(',', '.'));
            rango.productoVentaMinima = Number(variableDatos[4].toString().replace(',', '.'));;
            rango.productoVentaMaxima = Number(variableDatos[5].toString().replace(',', '.'));;
            if (ventaTotal >= rango.productoVentaMinima && ventaTotal <= rango.productoVentaMaxima) {
              this.entradaMinimaAplicadaPorcentaje = rango.entrada;
            }
            this.rangosSlider.push(rango);
          }
          this.sliderMinimo = this.rangosSlider[0].productoVentaMinima;
          this.sliderMaximo = this.rangosSlider[variableRangos.length - 2].productoVentaMaxima;
          this.sliderValor = Number(this.mensajeServicio.ValorTotal.replace(',', '.'));
          } catch (error) { }
          this.calcularTodosValores();
          // console.log(this.rangosSlider);
      } catch (error) {

      }
    }
  }
  onIngresosChange() {
    let entrada: number = this.FormularioDatosBasicos.controls['entrada'].value;
    let Total: number = this.FormularioDatosBasicos.controls['ventaTotal'].value;
    let plazos: number = this.FormularioDatosBasicos.controls['plazo'].value;
    const CreditoSinAdiciones = Total - entrada;
    const PARAMETRO_GESTION_CREDITO: number = Number(this.mensajeServicio.PARAMETRO_GESTION_CREDITO.replace(',', '.'));
    const IVA: number = (Number(this.mensajeServicio.IVA.replace(',', '.')) / 100);
    this.gestionCreditoSinIva = (PARAMETRO_GESTION_CREDITO * CreditoSinAdiciones).toFixed(2);
    this.gestionDocumentalSinIva = (Number(this.mensajeServicio.FEE_SERVICIO_DOCUMENTAL.replace(',', '.')).toFixed(2));
    let gestionCredito: number = (PARAMETRO_GESTION_CREDITO * CreditoSinAdiciones) * (IVA + 1);
    const FEE_SERVICIO_DOCUMENTAL: number = (Number(this.mensajeServicio.FEE_SERVICIO_DOCUMENTAL.replace(',', '.')) * (IVA + 1));
    let tasa: number = this.tasaActual;
    let diferencia : number = CreditoSinAdiciones + gestionCredito + FEE_SERVICIO_DOCUMENTAL;
    let valorTotalFactura: number = +Total + +gestionCredito + +FEE_SERVICIO_DOCUMENTAL;
    let porcentajeEntrada: number = (entrada / Total) * 100;
    this.gestionCreditoYGestionDocumentalSinIva =  ((Number(this.gestionDocumentalSinIva) + Number(this.gestionCreditoSinIva))).toFixed(2).toString();
    this.gestionCreditoYGestionDocumentalConIva =  (Number(this.gestionCreditoYGestionDocumentalSinIva) * (IVA + 1)).toFixed(2).toString();
    this.FormularioDatosBasicos.controls['gestionCreditoYDocumentalConIva'].setValue(this.gestionCreditoYGestionDocumentalConIva);
    this.FormularioDatosBasicos.controls['montoCredito'].setValue(diferencia.toFixed(2));
    // this.FormularioDatosBasicos.controls['gestionCredito'].setValue(gestionCredito.toFixed(2));
    this.FormularioDatosBasicos.controls['porcentajeEntrada'].setValue(porcentajeEntrada.toFixed(2));
    this.FormularioDatosBasicos.controls['valorTotalFactura'].setValue(valorTotalFactura.toFixed(2));
    let cuotaMensual = this.calcularCuotaFija(diferencia, plazos, tasa, entrada);
    let cuotaMensualDecimal = cuotaMensual;
    this.FormularioDatosBasicos.controls['cuotaMensualFija'].setValue(cuotaMensualDecimal.toFixed(2));
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
  onSliderChange(event: any) {
    this.FormularioDatosBasicos.controls['ventaTotal'].setValue(Number.parseFloat(event.value.toString().replace(',', '.')));
    this.calcularTodosValores();
  }
  calcularTodosValores() {
    // input
    let ventaProductos: number = 0;
    let entrada: number = 0;
    let plazo: number = 0;
    let tasa:number=0;

    // calculados
    let entradaMinima: number = 0;
    let porcentajeEntrada: number = 0;
    let valorTotalFactura: number = 0;
    let montoDeCredito: number = 0;
    let CuotaMensual: number = 0;
    let gestionCreditoYGestionDocumentalSinIva:number = 0;
    let gestionCreditoYGestionDocumentalConIva:number = 0;
    let indexRecalculogestionCreditoYGestionDocumentalSinIva:number = 0;
    let indexRecalculogestionCreditoYGestionDocumentalConIva:number = 0;
    let capacidadPagoMaxima: number = 0;
    let creditoMaxima: number = 0;
    this.entradaMinimaAplicada = '0';
    try {
      capacidadPagoMaxima = Number(this.FormularioDatosBasicos.controls['wsCapacidadPagoMax'].value.replace(',', '.'));
    } catch (error) {

    }
    try {
      creditoMaxima = Number(this.FormularioDatosBasicos.controls['wsCreditoSugerido'].value.replace(',', '.'));
    } catch (error)
    { }
    try {
      ventaProductos = this.FormularioDatosBasicos.controls['ventaTotal'].value;
      this.sliderValor = ventaProductos;
    } catch (error) { ventaProductos = 0;}
    try {
      tasa = Number.parseFloat(this.mensajeServicio.Tasa.replace(',', '.'));
    } catch (error) { tasa = 0;}
    try {
      entrada = this.FormularioDatosBasicos.controls['entrada'].value;

    } catch (error) { entrada = 0;}
    try {
      porcentajeEntrada = entrada / ventaProductos;
    } catch(error) { porcentajeEntrada =0;}
    try {
      plazo = this.FormularioDatosBasicos.controls['plazo'].value;
    } catch(error) { plazo=0;}
    const IVA: number = (Number(this.mensajeServicio.IVA.replace(',', '.')) / 100);

    const PARAMETRO_GESTION_CREDITO: number = Number(this.mensajeServicio.PARAMETRO_GESTION_CREDITO.replace(',', '.'));
    this.gestionCreditoSinIva = (PARAMETRO_GESTION_CREDITO * (ventaProductos - entrada)).toFixed(2);
    this.indexRecalculoGestionCreditoSinIva = (PARAMETRO_GESTION_CREDITO * (ventaProductos - this.indexRecalculoEntrada)).toFixed(2); // recalculo
    if (Number(this.gestionCreditoSinIva) <= 0) {
      this.gestionCreditoSinIva = '0';
    }
    this.gestionDocumentalSinIva = (Number(this.mensajeServicio.FEE_SERVICIO_DOCUMENTAL.replace(',', '.')).toFixed(2));
    if (Number(this.gestionDocumentalSinIva) <= 0) {
      this.gestionDocumentalSinIva = '0';
    }
    let gestionCredito: number = (PARAMETRO_GESTION_CREDITO * (ventaProductos - entrada)) * (IVA + 1);
    let indexRecalculogestionCredito: number = (PARAMETRO_GESTION_CREDITO * (ventaProductos - this.indexRecalculoEntrada)) * (IVA + 1); // recalculo
    const FEE_SERVICIO_DOCUMENTAL: number = (Number(this.mensajeServicio.FEE_SERVICIO_DOCUMENTAL.replace(',', '.')) * (IVA + 1));
    this.gestionCreditoYGestionDocumentalSinIva =  ((Number(this.gestionDocumentalSinIva) + Number(this.gestionCreditoSinIva))).toFixed(2).toString();
    this.indexRecalculoGestionCreditoYGestionDocumentalSinIva =  ((Number(this.gestionDocumentalSinIva) + Number(this.indexRecalculoGestionCreditoSinIva))).toFixed(2).toString(); // recalculo
    this.gestionCreditoYGestionDocumentalConIva =  (Number(this.gestionCreditoYGestionDocumentalSinIva) * (IVA + 1)).toFixed(2).toString();
    this.FormularioDatosBasicos.controls['gestionCreditoYDocumentalConIva'].setValue(this.gestionCreditoYGestionDocumentalConIva);

    try { gestionCreditoYGestionDocumentalSinIva =
      (Number(this.gestionDocumentalSinIva) + Number(this.gestionCreditoSinIva));
      indexRecalculogestionCreditoYGestionDocumentalSinIva =
      (Number(this.gestionDocumentalSinIva) + Number(this.indexRecalculoGestionCreditoSinIva)); // recalculo
      if (gestionCreditoYGestionDocumentalSinIva <= 0) {
        gestionCreditoYGestionDocumentalSinIva = 0;
      }
    } catch (error) { this.gestionCreditoYGestionDocumentalSinIva = "0"; }
    try { 
      gestionCreditoYGestionDocumentalConIva =
      (Number(this.gestionCreditoYGestionDocumentalSinIva) * (IVA + 1));
      indexRecalculogestionCreditoYGestionDocumentalConIva =
      (Number(this.indexRecalculoGestionCreditoYGestionDocumentalSinIva) * (IVA + 1)); // recalculo
      if (gestionCreditoYGestionDocumentalConIva <= 0) {
        gestionCreditoYGestionDocumentalConIva = 0;
      }
    } catch (error) { this.gestionCreditoYGestionDocumentalConIva = "0";}
    try {      
      montoDeCredito = ventaProductos - entrada + gestionCreditoYGestionDocumentalConIva;
      montoDeCredito=Number(montoDeCredito.toFixed(2));
      
      this.indexRecalculoCredito = ventaProductos - this.indexRecalculoEntrada + indexRecalculogestionCreditoYGestionDocumentalConIva;
      if (montoDeCredito <= 0) {
        montoDeCredito = 0;
      }
    } catch (error) { montoDeCredito = 0; }
    try {
      valorTotalFactura = +ventaProductos + gestionCreditoYGestionDocumentalConIva;
      this.indexRecalculovalorTotalFactura = +ventaProductos + indexRecalculogestionCreditoYGestionDocumentalConIva;
    } catch (error) { valorTotalFactura = 0; }
    try {
      CuotaMensual = this.calcularCuotaFija(montoDeCredito, plazo, tasa, entrada);
    } catch (error) { CuotaMensual = 0;}
    // asignar valores
    this.gestionCreditoYGestionDocumentalSinIva = gestionCreditoYGestionDocumentalSinIva.toFixed(2).toString();
    this.gestionCreditoYGestionDocumentalConIva = gestionCreditoYGestionDocumentalConIva.toFixed(2).toString();
    // this.FormularioDatosBasicos.controls['ventaTotal'].setValue(valorTotalFactura.toFixed(2));
    this.FormularioDatosBasicos.controls['valorTotalFactura'].setValue(valorTotalFactura.toFixed(2));
    this.FormularioDatosBasicos.controls['montoCredito'].setValue(montoDeCredito.toFixed(2));
    this.FormularioDatosBasicos.controls['cuotaMensualFija'].setValue(CuotaMensual.toFixed(2));
    if (montoDeCredito > Number(creditoMaxima.toFixed(2))) {
      this.mensajeMontoSuperior = 'Monto de crédito supera el máximo permitido';
    } else {
      this.mensajeMontoSuperior = '';
    }
    if (Number(CuotaMensual.toFixed(2)) > Number(capacidadPagoMaxima.toFixed(2))) {
      this.mensajeCuotaMensualSuperior = 'Cuota supera capacidad de pago';
    } else {
      this.mensajeCuotaMensualSuperior = '';
    }
    // this.FormularioDatosBasicos.controls['porcentajeEntrada'].setValue(porcentajeEntrada.toFixed(2).toString());
    let b = 0;
    for (b = 0; b < this.rangosSlider.length; b++) {
      if (montoDeCredito >= this.rangosSlider[b].montoMinimo && montoDeCredito <= this.rangosSlider[b].montoMaximo) {
        this.entradaMinimaAplicadaPorcentaje = this.rangosSlider[b].entrada;
        this.entradaMinimaAplicada = (this.indexRecalculovalorTotalFactura * (this.entradaMinimaAplicadaPorcentaje / 100)).toFixed(2).toString();
        if (Math.abs((Number(this.entradaMinimaAplicada) - this.indexRecalculoEntrada)) <= 0.01) {
          // console.log('Recalculo terminado en interacciones #: ' + this.indexRecalculo);
          this.indexRecalculo = 0;
        } else {
          this.indexRecalculoEntrada = Number(this.entradaMinimaAplicada);
          this.indexRecalculo++;
          this.calcularTodosValores();
        }
        // this.indexRecalculoEntrada = Number(this.entradaMinimaAplicada);
        // this.indexRecalculoEntradaSecuencial = this.indexRecalculoEntrada;
      }
    }
    if (montoDeCredito > this.rangosSlider[this.rangosSlider.length - 1].montoMaximo) {
        this.entradaMinimaAplicadaPorcentaje = this.rangosSlider[this.rangosSlider.length - 1].entrada;
        this.entradaMinimaAplicada = ((this.entradaMinimaAplicadaPorcentaje / 100) * (this.rangosSlider[this.rangosSlider.length - 1].montoMaximo / (1 - (this.entradaMinimaAplicadaPorcentaje / 100)))).toFixed(2).toString();
        this.entradaMinimaAplicada = (Number(this.entradaMinimaAplicada) + (ventaProductos - this.ventaMaximaLimiteMatriz)).toFixed(2).toString();
    }
    // Calculo de variables para ajuste de entrada minima recalculada con iteracciones
    
  }
  private initForm() {
    this.FormularioDatosBasicos = new FormGroup({
      // aplicadoPerfil: new FormControl({value: '0', disabled: true}),
      // aplicadoMontoVenta: new FormControl({ value: '0', disabled: true}),
      // aplicadoVentaTotal: new FormControl({ value: '0', disabled: true}),
      // aplicadoPorcentajeEntrada: new FormControl({ value: '0', disabled: true}),
      // aplicadoEntrada: new FormControl({ value: '0', disabled: true}),
      // aplicadoCuotaMensual: new FormControl({ value: '0', disabled: true}),
      // aplicadoMontoReferencial: new FormControl({ value: '0', disabled: true}),
      // aplicadoTasa: new FormControl({ value: '15', disabled: true}),
      // wsPerfilSugerido: new FormControl({value: '0', disabled: true}),
      wsCreditoSugerido: new FormControl({ value: '0', disabled: true}),
      // wsPorcentajeEntrada: new FormControl({ value: '0', disabled: true}),
      // wsEntradaSugerida: new FormControl({ value: '0', disabled: true}),
      // wsCreditoSugerido: new FormControl({ value: '0', disabled: true}),
      // wsProducto: new FormControl({ value: '0', disabled: true}, Validators.required),
      wsCapacidadPagoMax: new FormControl({ value: '0', disabled: true}),
      // ventaSolicitada: new FormControl({ value: '0', disabled: true}, Validators.required),
      ventaTotal: new FormControl({ value: '0'}, Validators.required),
      // porcentajeEntrada: new FormControl({ value: '0', disabled: true}, Validators.required),
      entrada: new FormControl({ value: '0'}, Validators.required),
      // gestionCredito: new FormControl({ value: '0', disabled: true}, Validators.required),
      // servicioDocumental: new FormControl({ value: '0', disabled: true}, Validators.required),
      montoCredito: new FormControl({ value: '0', disabled: true}, Validators.required),
      plazo: new FormControl({ value: '0'}, Validators.required),
      cuotaMensualFija: new FormControl({ value: '0', disabled: true}, Validators.required),
      valorTotalFactura: new FormControl({ value: '0', disabled: true}, Validators.required),
      gestionCreditoYDocumentalConIva: new FormControl({ value: '0', disabled: true}, Validators.required)
    });
  }
  ValidarFormularioDatosBasicos(content: any, tipo: string) {
    if (this.mensajeServicio !== undefined) {
    if (this.FormularioDatosBasicos.valid) {
      this.loading = true;
      // console.log('Inicio Proceso...' + this.FormularioDatosBasicos.status);
      let valoresSimulador: ValoresSimulador = new ValoresSimulador();
      valoresSimulador.tipoValidacion = tipo;
      valoresSimulador.idCredito = this.mensajeServicio.NumeroCredito;
      valoresSimulador.lblSucursal = this.mensajeServicio.idSucursal;
      valoresSimulador.seMonto = this.FormularioDatosBasicos.controls['montoCredito'].value;
      valoresSimulador.lblPerfilCliente = this.mensajeServicio.Perfil;
      valoresSimulador.cmbProducto = this.wsProducto;
      // valoresSimulador.lblSucursal = localStorage.getItem('codigoSucursal');
      valoresSimulador.seVentaTotalAplicada = this.FormularioDatosBasicos.controls['ventaTotal'].value;
      try{
        valoresSimulador.seMontoSugerido = Number(this.mensajeServicio.MontoSugerido.replace(',', '.'));
      } catch (error) {
        valoresSimulador.seMontoSugerido = 0;
      }
      valoresSimulador.seEntrada = this.FormularioDatosBasicos.controls['entrada'].value;
      valoresSimulador.seValorTotal = this.FormularioDatosBasicos.controls['ventaTotal'].value;
      valoresSimulador.sePlazo = this.FormularioDatosBasicos.controls['plazo'].value;
      try {
        valoresSimulador.seTasa = Number(this.mensajeServicio.Tasa.toString().replace(',', '.'));
      } catch (error) {
        valoresSimulador.seTasa = 0;
      }
      valoresSimulador.lblPlazoSugerido = this.FormularioDatosBasicos.controls['plazo'].value;
      valoresSimulador.relacionLaboral = '';
      valoresSimulador.seCuotaFija = this.FormularioDatosBasicos.controls['cuotaMensualFija'].value;
      valoresSimulador.TipoId = '';
      valoresSimulador.PerfilAplicado = this.mensajeServicio.PerfilAplicado; // this.FormularioDatosBasicos.controls['aplicadoPerfil'].value;
      valoresSimulador.MontoAprobado = this.FormularioDatosBasicos.controls['valorTotalFactura'].value;
      valoresSimulador.usuario = localStorage.getItem("usuario");
      valoresSimulador.ruc = this.mensajeServicio.Cedula;
      valoresSimulador.entradaAplicada = this.FormularioDatosBasicos.controls['entrada'].value;
      valoresSimulador.capacidadPagoSugerida = Number(this.mensajeServicio.CapacidadPagoSugerida.toString().replace(',', '.'));
      valoresSimulador.EstadoCivil = '';
      valoresSimulador.IngresoValidado = this.mensajeServicio.IngresoValidado;
      valoresSimulador.BaseUrl = '';
      valoresSimulador.nombreConsultado = this.mensajeServicio.NombreConsultado;
      valoresSimulador.fechaNacimiento = this.mensajeServicio.FechaNacimiento;
      try {
        valoresSimulador.entradaSugerida = this.entradaMinimaAplicada.toString(); // this.FormularioDatosBasicos.controls['wsEntradaSugerida'].value;
      } catch (error) {
        valoresSimulador.entradaSugerida = '0';
      }
      valoresSimulador.gestionCredito = this.gestionCreditoSinIva;
      valoresSimulador.servicioDocumental = this.gestionDocumentalSinIva;

      this.fabricaService.getcalcularValoresSimulador(valoresSimulador).subscribe(
        (data: any) => {
          // this.datosGenerales = data;
          // console.log('Data Recibida WS:');
          // console.log(data);
          //this.FormularioDatosBasicos.controls['aplicadoPerfil'].setValue(data.lblPerfilAplicado);
          this.mensajeServicio.PerfilAplicado = data.lblPerfilAplicado;
          // let montoCredito: number = data.seMontoAprobado;
          // let entrada: number = data.seEntradaAplicada;
          // let VentaTotal: number = montoCredito + entrada;
          // this.FormularioDatosBasicos.controls['aplicadoMontoVenta'].setValue(data.ventaTotalReal.toString().replace(',', '.'));
          // this.FormularioDatosBasicos.controls['aplicadoVentaTotal'].setValue(data.seMontoAprobado.toString().replace(',', '.'));
          // this.FormularioDatosBasicos.controls['aplicadoPorcentajeEntrada'].setValue(data.lblPorcentajeEntradaAplicada.toString().replace(',', '.'));
          // this.FormularioDatosBasicos.controls['aplicadoEntrada'].setValue(data.seEntradaAplicada.toString().replace(',', '.'));
          // let cuotaMensual = this.calcularCuotaFija(data.seMontoAprobado.toString().replace(',', '.'), valoresSimulador.sePlazo, valoresSimulador.seTasa, data.seEntradaAplicada.toString().replace(',', '.'));
          // this.FormularioDatosBasicos.controls['aplicadoCuotaMensual'].setValue(cuotaMensual.toFixed(2).toString().replace(',', '.'));
          // this.FormularioDatosBasicos.controls['aplicadoMontoReferencial'].setValue(data.lblventaMaxSugerida.toString().replace(',', '.'));
          this.listadoErrores = data.listaErrores;
          // if (tipo === 'Inicial') {
          //     this.loading = false;
          // }
          if (tipo === 'Validar' || tipo === 'Inicial') {
            if (this.listadoErrores.length > 0) {
              this.errorMessage = 'Alerta !';
              this.loading = false;
              this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
            } else {
              // Sin errores seguir con siguiente paso
              this.loading = false;
              this.successMessage = 'Validación Correcta!';
              // this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
            }
          }
          if (tipo === 'Continuar') {
            if (this.listadoErrores.length > 0) {
              this.loading = false;
              this.errorMessage = 'Alerta !:';
              this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
            } else {
              // Sin errores seguir con siguiente paso
              // console.log(data);
              this.mensajeServicio.Estado = data.estadoCredito;
              this.mensajeServicio.PerfilAplicado = data.lblPerfilAplicado;
              this.mensajeServicio.Entrada = data.entradaReal;
              this.mensajeServicio.ValorTotal = data.ventaTotalReal;
              this.mensajeServicio.Monto = data.montoCreditoReal;
              this.fabricaService.changeMessage(this.mensajeServicio);
              this.loading = false;
              this.router.navigate(['/fabrica/nueva-solicitud/solicitud-credito/' + this.mensajeServicio.NumeroCredito]);
            }
          }
          // this.router.navigate(['/fabrica/nueva-solicitud/credito']);
        }, ( errorServicio ) => {
          // this.modalService.dismissAll();
        }
      );
    } else {
      // this.errorMessage = 'Por favor ingrese los datos necesarios';
      // this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
    }
    }
  }
  generarCancelacion(motivo: string) {
    this.modalService.dismissAll();
    this.fabricaService.getCancelarSolicitud(this.mensajeServicio.NumeroCredito,
                                            localStorage.getItem('usuario'), motivo).subscribe(
      data => {
        if (data.toString() === 'Solicitud Cancelada exitosamente!') {
          this.mensajeServicio.Estado = 'Cancelada';
          this.successMessage = data.toString();
        }
      });
    setTimeout (() => {
    }, 2500);
    this.router.navigate(['/fabrica/consulta-general']);
  }
  // bkm
}

export class RangosSlider {
  public aplicado: number;
  public entrada: number;
  public perfil: number;
  public montoMaximo: number;
  public montoMinimo: number;
  public enUso: boolean;
  public productoVentaMinima: number;
  public productoVentaMaxima: number;
}