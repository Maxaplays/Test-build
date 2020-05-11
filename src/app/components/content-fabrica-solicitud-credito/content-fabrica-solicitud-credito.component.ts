import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Direccion, DireccionesService} from '../../services/direcciones/direcciones.service';
import {TelefonosService} from '../../services/telefonos/telefonos.service';
import {map} from 'rxjs/operators';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { TipoDocumentacionService } from '../../services/tipo-documentacion.service';


@Component({
  selector: 'app-content-fabrica-solicitud-credito',
  templateUrl: './content-fabrica-solicitud-credito.component.html',
  styleUrls: ['./content-fabrica-solicitud-credito.component.css']
})
export class ContentFabricaSolicitudCreditoComponent implements OnInit {
  closeResult: string;
  // bkm
  mensajeServicio: DatosFabrica;

  // formas para ingreso y edición de datos - bkm
  formaDirecciones: FormGroup;
  formaTelefonos: FormGroup;
  FormularioDatosCliente: FormGroup;

  // variables para presentacion - bkm
  tipoDir: any[] = [];
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];
  barrios: any[] = [];
  tipoTel: any[] = [];
  telefonos: any[] = [];
  direcciones: any[] = [];
  tipoDoc: any[];
  tipoRegDir: any[] = ['CLIENTE', 'GARANTE'];
  tipoRegTel: any[] = ['CLIENTE', 'GARANTE'];

  ID_CLI =  '1716822679';
  // bkm
  // tslint:disable-next-line:max-line-length
  constructor(private modalService: NgbModal,
              private direccionesService: DireccionesService,
              private telefonoService: TelefonosService,
              private fabricaService: FabricaService,
              private tipoDocumentacionService: TipoDocumentacionService,
              private fb: FormBuilder) {
}

  ngOnInit() {
    this.crearFormularioDirecciones();
    this.crearFormularioCliente();
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        this.telefonos = this.getTelefonos();
        this.direcciones = this.getDirecciones();
        this.tipoDir = this.getTipoDir();
        this.provincias = this.getProvincia();
        this.cantones = this.getCanton();
        this.barrios = this.getBarrio();
        this.tipoTel = this.getTipoTel();
        this.tipoDoc = this.getTipoDoc();
        // console.log(data);
      });
  }
  crearFormularioCliente() {
    this.FormularioDatosCliente = new FormGroup({
      tipoDocumentacion: new FormControl(null, Validators.required),
      cedula: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      nombreCliente: new FormControl(null, Validators.required),
      apellidoCliente: new FormControl(null, Validators.required),
      fechaNacimiento: new FormControl(null, Validators.required),
      genero: new FormControl(null, Validators.required),
      nacionalidad: new FormControl(null, Validators.required),
      estadoCivil: new FormControl(null, Validators.required),
      cargasFamiliares: new FormControl(null, Validators.required),
      emailCliente: new FormControl(null, Validators.required),
      profesionCliente: new FormControl(null),
      rucTrabajo: new FormControl(null),
      razonSocialTrabajo: new FormControl(null)
    });
  }
  private getTipoDoc(): any {
    this.tipoDocumentacionService.getTipoDoc()
        .subscribe( (resultado: any[] ) => {
          this.tipoDoc = resultado;
          // console.log(this.tipoDoc);
        });
  }
  openLg(content) {
    this.crearFormularioDirecciones();
    this.modalService.open(content);
  }

  openCustomWidth(content) {
    // bkm - inicializar formas
    this.crearFormularioTelefonos();
    this.modalService.open(content, {windowClass: 'custom-width-modal'});
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  getTipoDir(): any {
    this.direccionesService.getTipoDir()
      .pipe(map (data => data["TIPODIR"]))
      .subscribe((data: any) => {
        this.tipoDir = data;
        console.log(this.tipoDir);
      });
  }

  public getProvincia(): any {
    this.direccionesService.getProvincia()
      .pipe(map (data => data["PROVINCIA"]))
      .subscribe((data: any) => {
        this.provincias = data;
        console.log(this.provincias);
      });
  }

  public getCanton(): any {
    if (this.formaDirecciones.value.Provincia !== '') {
      this.direccionesService.getCanton(this.formaDirecciones.value.Provincia)
        .pipe(map(data => data["CANTON"]))
        .subscribe((data: any) => {
          this.cantones = data;
          console.log(this.cantones);
        });
    }
  }

  public getParroquia(): any {

    if (this.formaDirecciones.value.Canton !== '') {
      this.direccionesService.getParroquia(this.formaDirecciones.value.Canton)
        .pipe(map(data=> data["PARROQUIA"]))
        .subscribe((data: any) => {
          this.parroquias = data;
          console.log(this.parroquias);
        });
    }
  }

  public getBarrio(): any {
    if (this.formaDirecciones.value.Parroquia !== '') {
      this.direccionesService.getBarrio(this.formaDirecciones.value.Parroquia)
        .pipe(map(data=> data["BARRIO"]))
        .subscribe((data: any) => {
          this.barrios = data;
          console.log(this.barrios);
        });
    }
  }

  public getTipoTel(): any {
    this.telefonoService.getTipoTelefonos()
      .pipe(map(data => data["TIPTEL"]))
      .subscribe((data: any) => {
        this.tipoTel = data;
      });
  }

  public getTelefonos(): any {
    this.telefonoService.getTelefonos(this.mensajeServicio.Cedula)
      .pipe(map(data => data["TELEFONOS"]))
      .subscribe((data: any) => {
        this.telefonos = data;
        console.log(data);
      });
  }

  public getDirecciones(): any {
    this.direccionesService.getDirecciones(this.mensajeServicio.Cedula, this.mensajeServicio.NumeroCredito, this.mensajeServicio.Cedula)
      .pipe(map(data => data["DIRECCIONES"]))
      .subscribe((data: any) => {
        this.direcciones = data;
      });
  }

  get tipoRegistroNoValido() {
    return this.formaDirecciones.get('tipoRegistro').invalid && this.formaDirecciones.get('tipoRegistro').touched;
  }

  get tipoDireccionNoValida() {
    return this.formaDirecciones.get('tipoDireccion').invalid && this.formaDirecciones.get('tipoDireccion').touched;
  }

  get ProvinciaNoValida() {
    return this.formaDirecciones.get('Provincia').invalid && this.formaDirecciones.get('Provincia').touched;
  }

  get CantonNoValido() {
    return this.formaDirecciones.get('Canton').invalid && this.formaDirecciones.get('Canton').touched;
  }

  get ParroquiaNoValida() {
    return this.formaDirecciones.get('Parroquia').invalid && this.formaDirecciones.get('Parroquia').touched;
  }

  get BarrioNoValido() {
    return this.formaDirecciones.get('Barrio').invalid && this.formaDirecciones.get('Barrio').touched;
  }

  get CallePrincipalNoValida() {
    return this.formaDirecciones.get('CallePrincipal').invalid && this.formaDirecciones.get('CallePrincipal').touched;
  }

  get NumeroCallelNoValido() {
    return this.formaDirecciones.get('NumeroCalle').invalid && this.formaDirecciones.get('NumeroCalle').touched;
  }

  get CalleSecundariaNoValida() {
    return this.formaDirecciones.get('CalleSecundaria').invalid && this.formaDirecciones.get('CalleSecundaria').touched;
  }

  get ReferenciaDireccionNoValida() {
    return this.formaDirecciones.get('ReferenciaDireccion').invalid && this.formaDirecciones.get('ReferenciaDireccion').touched;
  }

  get CodigoPostalDireccionNoValido() {
    return this.formaDirecciones.get('CodigoPostalDireccion').invalid && this.formaDirecciones.get('CodigoPostalDireccion').touched;
  }

  get NumeroTelefonoNoValido() {
    return this.formaTelefonos.get('NumeroTelefono').invalid && this.formaTelefonos.get('NumeroTelefono').touched;
  }

  crearFormularioDirecciones() {
    this.formaDirecciones = this.fb.group({
      tipoRegistro: ['', Validators.required],
      tipoDireccion: ['', Validators.required],
      Provincia: ['', Validators.required],
      Canton: ['', Validators.required],
      Parroquia: ['', Validators.required],
      Barrio: [''],
      CallePrincipal: ['', Validators.required],
      NumeroCalle: ['', Validators.required],
      CalleSecundaria: [''],
      ReferenciaDireccion: [''],
      CodigoPostalDireccion: ['', [Validators.minLength(6), Validators.pattern('^[0-9]*$')]]
    });
  }

  crearFormularioTelefonos() {
    this.formaTelefonos = this.fb.group({
      TipoRegistroTelefono: ['CLIENTE'],
      TipoTelefono: ['FIJO'],
      CodigoTelefono: ['02'],
      NumeroTelefono: ['', [Validators.required, Validators.minLength(7), Validators.pattern('^[0-9]*$')]],
      ExtensionTelefono: ['']
    });
  }

  guardarDireccion() {
    console.log(this.formaDirecciones);
    if (this.formaDirecciones.invalid) {
      return Object.values(this.formaDirecciones.controls).forEach(control => {
        if (control instanceof FormGroup) {
          // tslint:disable-next-line:no-shadowed-variable
          Object.values(control.controls). forEach( control => control.markAllAsTouched());
        } else {
          control.markAllAsTouched();
        }
      });
    } else {
      console.log(this.formaDirecciones);
      const direccion: Direccion = new Direccion();
      direccion.tipoRegistro = this.formaDirecciones.value.tipoRegistro;
      direccion.tipoDireccion = this.formaDirecciones.value.tipoDireccion;
      direccion.Provincia = this.formaDirecciones.value.Provincia;
      direccion.Canton = this.formaDirecciones.value.Canton;
      direccion.Parroquia = this.formaDirecciones.value.Parroquia;
      direccion.Barrio = this.formaDirecciones.value.Barrio;
      direccion.CallePrincipal = this.formaDirecciones.value.CallePrincipal;
      direccion.NumeroCalle = this.formaDirecciones.value.NumeroCalle;
      direccion.CalleSecundaria = this.formaDirecciones.value.CalleSecundaria;
      direccion.Referencia = this.formaDirecciones.value.ReferenciaDireccion;
      direccion.CodigoPostal = this.formaDirecciones.value.CodigoPostalDireccion;
      direccion.Cedula = this.mensajeServicio.Cedula;
      console.log(direccion);
      this.direccionesService.postDireccion(direccion).subscribe(
        (data: any) => {
          if (data.resultado !== null) {
            this.direcciones = this.getDirecciones();
          }
        }
      );
    }
  }

  guardarTelefono() {
    console.log(this.formaTelefonos);
    if (this.formaTelefonos.invalid) {
      return Object.values(this.formaTelefonos.controls).forEach(control => {
        if (control instanceof FormGroup) {
          // tslint:disable-next-line:no-shadowed-variable
          Object.values(control.controls). forEach( control => control.markAllAsTouched());
        } else {
          control.markAllAsTouched();
        }
      });
    } else {
      this.telefonoService.postTelefono(this.formaTelefonos.value.TipoTelefono,
                                        this.mensajeServicio.Cedula,
                             this.formaTelefonos.value.CodigoTelefono.toString() + this.formaTelefonos.value.NumeroTelefono.toString(),
                                        this.formaTelefonos.value.ExtensionTelefono).subscribe(
        (data: any) => {
          console.log(data);
          if (data.error !== null) {
            console.log(data.error);
          } else {
            this.telefonos = this.getTelefonos();
          }
        }, (errorServicio) => {
          console.log('Error');
        }
      );
    }
  }
}

