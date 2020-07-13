import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { TipoDocumentacionService } from 'src/app/services/tipo-documentacion.service';
import { map } from 'rxjs/operators';
import { FormGroup, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import { FabricaService, EnvioFabricaServiceBi, DatosFabrica } from '../../services/fabricaCredito/fabrica.service';
import { Router } from '@angular/router';
import { TipoContactoService } from '../../services/tipoContacto/tipo-contacto.service';
import { ProductoService } from '../../services/producto/producto.service';
import { EstadoCivilService } from '../../services/estadoCivil/estado-civil.service';

@Component({
  selector: 'app-content-fabrica',
  templateUrl: './content-fabrica.component.html',
  styleUrls: ['./content-fabrica.component.css']
})

export class ContentFabricaComponent implements OnInit {
  closeResult: string;
  private _error = new Subject<string>();
  private _success = new Subject<string>();

  staticAlertClosed = false;
  errorMessage: string;
  successMessage: string;
  loading: boolean;
  // bkm
  FormularioDatosBasicos: FormGroup; // formulario de react driven del HTML
  tipoDoc: any[] = []; // tipo de documento para el combo
  tipoContacto: any[] = []; // tipo de contacto para el combo
  productos: any = []; // tipos de productos para el combo
  estadoCivil: any = []; // tipos de estados civiles para el combo
  datosGenerales: DatosFabrica; // Objeto con los datos de cabecera del credito obtenido localmente del servicio
  mensajeServicio: DatosFabrica;
  mensajeValidacion: string;
  mensajeValidacionInterno: string;
  idCreditoPrevioIngresado: string;
  linkIdCreditoPrevioIngresado: string;
  // bkm

  constructor(private modalService: NgbModal,
              private tipoDocumentacionService: TipoDocumentacionService,
              private fabricaService: FabricaService,
              private router: Router,
              private tipoContactoService: TipoContactoService,
              private productosService: ProductoService,
              private estadoCivilService: EstadoCivilService) {
  }
  ngOnInit(): void {
    this.initForm(); // inicializar la forma de la pantalla de ReactDriven
    this.tipoDoc = this.getTipoDoc(); // CARGA DEL COMBO DE TIPO DE documentos
    this.getProducto(); // cargar combo de productos
    this.getTipoContacto(); // cargar Tipos de contactos
    this.getEstadoCivil(); // cargar combo de estado civil
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._error.subscribe((message) => this.errorMessage = message);
    this._error.pipe(
      debounceTime(5000)
    ).subscribe(() => this.errorMessage = null);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(50000)
    ).subscribe(() => this.successMessage = null);

    this.fabricaService.currentMessage.subscribe(data => this.mensajeServicio = data);
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  public changeErrorMessage() {
    this._error.next('Entrada mínima requerida para cobertura USD$2.476,34');
  }

  public showSuccessMessage() {
    this._success.next('Se guardó la información exitosamente.');
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  openErrorWidth(content) {
    this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
  }

  // bkm metodos
  private getTipoDoc(): any {
    this.tipoDocumentacionService.getTipoDoc()
        .subscribe( (resultado: any[] ) => {
          this.tipoDoc = resultado;
          // console.log(this.tipoDoc);
        });
  }
  getTipoContacto() {
    this.tipoContactoService.getTipoContacto().subscribe(
      (data: any) => {
        this.tipoContacto = data.DISPOSITIVO;
        // console.log(this.tipoContacto);
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
  getProducto() {
    console.log(localStorage.getItem('codigoSucursal'));
    this.productosService.getProductos(localStorage.getItem('codigoSucursal')).subscribe(
      (data: any) => {
        this.productos = data.PRODUCTO;
        // console.log(this.productos);
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
  getEstadoCivil() {
    this.estadoCivilService.getEstadoCivil().subscribe(
      (data: any) => {
        this.estadoCivil = data.ESTADO_CIVIL;
        // console.log(this.estadoCivil);
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
  onIngresosChange() {
    let depen : number = this.FormularioDatosBasicos.controls['ingresosDependiente'].value;
    let indepen : number = this.FormularioDatosBasicos.controls['ingresosIndependiente'].value;
    let suma : number = +depen + +indepen;
    this.FormularioDatosBasicos.controls['ingresosDisponible'].setValue(suma);
  }
  private initForm() {
    this.FormularioDatosBasicos = new FormGroup({
      tipoDocumentacion: new FormControl('CED' , [Validators.required]),
      cedula: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      estadoCivil: new FormControl(null),
      // fechaNacimiento: new FormControl(null),
      ingresosDependiente: new FormControl('0', Validators.required),
      ingresosIndependiente: new FormControl('0', Validators.required),
      ingresosDisponible: new FormControl({value: '0', disabled: true}, Validators.required),
      tipoContacto: new FormControl(null, Validators.required),
      telefonoContacto: new FormControl(null, Validators.required),
      observacionesContacto: new FormControl(''),
      formularioPreimpreso: new FormControl(null),
      ventaTotal: new FormControl(null, Validators.required),
      producto: new FormControl(null, Validators.required)
    });
  }
  ValidarFormularioDatosBasicos(content) {
    if (this.FormularioDatosBasicos.valid) {
      // console.log('Inicio Proceso...' + this.FormularioDatosBasicos.status);
      this.loading = true;
      let envioDatos: EnvioFabricaServiceBi = new EnvioFabricaServiceBi();
      envioDatos.cedula = this.FormularioDatosBasicos.controls['cedula'].value;
      envioDatos.tipoDocumento = this.FormularioDatosBasicos.controls['tipoDocumentacion'].value;
      envioDatos.estadoCivil = this.FormularioDatosBasicos.controls['estadoCivil'].value;
      // envioDatos.fechaNacimiento = this.FormularioDatosBasicos.controls['fechaNacimiento'].value;
      envioDatos.fechaNacimiento = '';
      envioDatos.IngresosIndependiente = this.FormularioDatosBasicos.controls['ingresosIndependiente'].value;
      envioDatos.IngresoDependiente = this.FormularioDatosBasicos.controls['ingresosDependiente'].value;
      envioDatos.VentaTotal = this.FormularioDatosBasicos.controls['ventaTotal'].value;
      envioDatos.Producto = this.FormularioDatosBasicos.controls['producto'].value;
      envioDatos.IdSucursal = localStorage.getItem('codigoSucursal');
      envioDatos.Usuario = localStorage.getItem('usuario');
      envioDatos.tipoTelefono = this.FormularioDatosBasicos.controls['tipoContacto'].value;
      envioDatos.valorTelefono = this.FormularioDatosBasicos.controls['telefonoContacto'].value;
      envioDatos.observacionesTelefono = this.FormularioDatosBasicos.controls['observacionesContacto'].value;

      this.fabricaService.getEnvioFabricaServiceBi(envioDatos).pipe(map (data => data["Table1"][0])).subscribe(
        (data: DatosFabrica) => {
          this.datosGenerales = data;
          this.datosGenerales.Cedula = envioDatos.cedula;
          this.datosGenerales.Estado = 'Consultado';
          this.datosGenerales.FechaCreacion = new Date().toDateString();
          this.datosGenerales.AsesorAsociado = localStorage.getItem('usuario'); // nombre de usuario;
          this.datosGenerales.idSucursal = localStorage.getItem('codigoSucursal');
          this.datosGenerales.idProducto = this.FormularioDatosBasicos.controls['producto'].value;
          this.fabricaService.changeMessage(this.datosGenerales);
          // console.log('Padre:');
          if (this.datosGenerales.Error === 'Solicitud creada exitosamente') {
            this.loading = false;
            this.router.navigate(['/fabrica/nueva-solicitud/credito']);
          } else {
            if (this.datosGenerales.Error === 'El cliente ya tiene una solicitud previa:') {
              // Credito de cliente duplicado
              this.mensajeValidacion = 'Alerta !:';
              this.mensajeValidacionInterno = this.datosGenerales.Error + data.CreditoAnterior;
              this.linkIdCreditoPrevioIngresado = '/fabrica/nueva-solicitud/solicitud-credito?idCre=' + data.CreditoAnterior;
              this.idCreditoPrevioIngresado = data.CreditoAnterior;
              // console.log(this.linkIdCreditoPrevioIngresado);
              // console.log(this.idCreditoPrevioIngresado);
              this.loading = false;
              this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
              setTimeout (() => {
              }, 5500);
              this.router.navigate(['/fabrica/consulta-general']);
            } else {
              // Error General
              this.mensajeValidacion = 'Alerta !:';
              this.mensajeValidacionInterno = this.datosGenerales.Error;
              // console.log(this.mensajeValidacion);
              // console.log(this.mensajeValidacionInterno);
              this.loading = false;
              this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
              setTimeout (() => {
              }, 2500);
              this.router.navigate(['/fabrica/consulta-general']);
            }
          }
        }, ( errorServicio ) => {
          // console.log('Error');
        }
      );
    } else {
      // console.log('Formulario Inválido...' + this.FormularioDatosBasicos.status);
      return Object.values(this.FormularioDatosBasicos.controls).forEach(control => {
        if (control instanceof FormGroup) {
          // tslint:disable-next-line:no-shadowed-variable
          Object.values(control.controls). forEach( control => control.markAllAsTouched());
        } else {
          control.markAllAsTouched();
        }
      });
    }
  }
  // bkm metodos
}
