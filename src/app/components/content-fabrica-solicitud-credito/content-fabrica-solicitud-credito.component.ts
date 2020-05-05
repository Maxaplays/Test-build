import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DireccionesService} from '../../services/direcciones/direcciones.service';
import {TelefonosService} from '../../services/telefonos/telefonos.service';
import {map} from 'rxjs/operators';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


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

  // variables para presentacion - bkm
  tipoDir: any[] = [];
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];
  barrios: any[] = [];
  tipoTel: any[] = [];
  telefonos: any[] = [];
  tipoRegDir: any[] = ['CLIENTE', 'GARANTE'];
  tipoRegTel: any[] = ['CLIENTE', 'GARANTE'];


  ID_CLI =  '1716822679';
  // bkm
  // tslint:disable-next-line:max-line-length
  constructor(private modalService: NgbModal,
              private direccionesService: DireccionesService,
              private telefonoService: TelefonosService,
              private fabricaService: FabricaService,
              private fb: FormBuilder) {
    this.crearFormularioDirecciones();
    this.crearFormularioTelefonos();
    this.tipoDir = this.getTipoDir();
    this.provincias = this.getProvincia();
    this.cantones = this.getCanton();
    this.barrios = this.getBarrio();
    this.tipoTel = this.getTipoTel();
    this.telefonos = this.getTelefonos();
  }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        this.mensajeServicio = data;
        // console.log(data);
      });
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
    this.telefonoService.getTelefonos(this.ID_CLI)
      .pipe(map(data => data["TELEFONOS"]))
      .subscribe((data: any) => {
        this.telefonos = data;
        console.log(data);
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
      Barrio: ['', Validators.required],
      CallePrincipal: ['', Validators.required],
      NumeroCalle: ['', Validators.required],
      CalleSecundaria: ['', Validators.required],
      ReferenciaDireccion: ['', Validators.required],
      CodigoPostalDireccion: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')]]
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
                                 '1716822679',
                             this.formaTelefonos.value.CodigoTelefono.toString() + this.formaTelefonos.value.NumeroTelefono.toString(),
                                        this.formaTelefonos.value.ExtensionTelefono).subscribe(
        (data: any) => {
          console.log(data);
          if(data.error !== null) {
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

