import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Direccion, DireccionesService} from '../../services/direcciones/direcciones.service';
import {TelefonosService} from '../../services/telefonos/telefonos.service';
import {debounceTime, map} from 'rxjs/operators';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { TipoDocumentacionService } from '../../services/tipo-documentacion.service';
import { ActivatedRoute } from '@angular/router';
import { SituacionFinancieraService } from '../../services/situacionFinanciera/situacion-financiera.service';
import {Subject} from 'rxjs';
import { GeneroService } from '../../services/genero/genero.service';
import { NacionalidadesService } from '../../services/nacionalidades/nacionalidades.service';
import { EstadoCivilService } from '../../services/estadoCivil/estado-civil.service';
import { ProfesionService } from '../../services/profesion/profesion.service';


@Component({
  selector: 'app-content-fabrica-solicitud-credito',
  templateUrl: './content-fabrica-solicitud-credito.component.html',
  styleUrls: ['./content-fabrica-solicitud-credito.component.css']
})
export class ContentFabricaSolicitudCreditoComponent implements OnInit {
  closeResult: string;
  private _error = new Subject<string>();
  private _success = new Subject<string>();

  staticAlertClosed = false;
  errorMessage: string;
  successMessage: string;
  loading: boolean;
  // bkm
  mensajeServicio: DatosFabrica;
  crearDireccion = true;
  crearTelefono = true;
  codigoDireccion: 0;
  codigoTelefono: 0;
  idCredito: string;

  // formas para ingreso y edición de datos - bkm
  formaDirecciones: FormGroup;
  formaTelefonos: FormGroup;
  FormularioDatosCliente: FormGroup;
  formaSituacionFinanciera: FormGroup;

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
  generos: any[];
  nacionalidades: any[];
  estadoCivil: any = []; // tipos de estados civiles para el combo
  profesiones: any = [];
  tipoRegDir: any[] = ['CLIENTE', 'GARANTE'];
  tipoRegTel: any[] = ['CLIENTE', 'GARANTE'];
  situacionFinancieraIngresos: any[] = [];


  // bkm
  // tslint:disable-next-line:max-line-length
  constructor(private modalService: NgbModal,
              private direccionesService: DireccionesService,
              private telefonoService: TelefonosService,
              private fabricaService: FabricaService,
              private tipoDocumentacionService: TipoDocumentacionService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private situacionFinancieraService: SituacionFinancieraService,
              private generoService: GeneroService,
              private nacionalidadesService: NacionalidadesService,
              private estadoCivilService: EstadoCivilService,
              private profesionService: ProfesionService) {
                this.crearFormularioDirecciones();
                  this.crearFormularioCliente();
                  this.crearFormularioTelefonos();
              this.activatedRoute.queryParams.subscribe(params => {
                  this.idCredito = params['idCre'];
                  if (typeof this.idCredito !== 'undefined') {
                      this.fabricaService.getRetomarCredito(this.idCredito, localStorage.getItem('usuario')).pipe(map (data => data["Table1"][0])).subscribe(
                        (data: DatosFabrica) => {
                          console.log(data);
                          this.fabricaService.changeMessage(data);
                        });
                    }
              });
              this.fabricaService.currentMessage.subscribe(
                data => {
                  
                  this.mensajeServicio = data;
                  this.direcciones = this.getDirecciones();
                  this.telefonos = this.getTelefonos();
                  this.tipoDir = this.getTipoDir();
                  this.provincias = this.getProvincia();
                  this.cantones = this.getCanton();
                  this.barrios = this.getBarrio();
                  this.tipoTel = this.getTipoTel();
                  this.tipoDoc = this.getTipoDoc();
                  this.telefonos = this.getTelefonos();
                  this.getGeneros();
                  this.getNacionalidades();
                  this.getEstadoCivil();
                  this.getProfesiones();
                });
}

  ngOnInit() {
    
    this._error.subscribe((message) => this.errorMessage = message);
    this._error.pipe(
      debounceTime(5000)
    ).subscribe(() => this.errorMessage = null);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(50000)
    ).subscribe(() => this.successMessage = null);
  }

  public showSuccessMessage() {
    this._success.next('Se guardó la información exitosamente.');
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
        });
  }
  openLg(content, direccion: any) {
    if (direccion === undefined || direccion === '') {
      this.crearDireccion = true;
      this.crearFormularioDirecciones();
    } else {
      this.crearDireccion = false;
      this.cargarFormularioDirecciones(direccion);
    }
    this.modalService.open(content);
  }

  openCustomWidth(content, telefono: any) {
    // bkm - inicializar formas
    if ( telefono === undefined || telefono === '') {
      this.crearTelefono = true;
      this.codigoTelefono = 0;
      this.crearFormularioTelefonos();
    } else {
      this.crearTelefono = false;
      this.cargarFormularioTelefonos(telefono);
    }
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
      });
  }

  public getProvincia(): any {
    this.direccionesService.getProvincia()
      .pipe(map (data => data["PROVINCIA"]))
      .subscribe((data: any) => {
        this.provincias = data;
      });
  }
  getGeneros(){
    this.generoService.getGeneros()
      .pipe(map (data => data["GENERO"]))
      .subscribe((data: any) => {
        this.generos = data;
      });
  }
  getNacionalidades(){
    this.nacionalidadesService.getNacionalidades()
      .pipe(map (data => data["NACIONALIDAD"]))
      .subscribe((data: any) => {
        this.nacionalidades = data;
      });
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
  getProfesiones() {
    this.profesionService.getProfesiones().subscribe(
      (data: any) => {
        this.profesiones = data.PROFESION;
        // console.log(this.estadoCivil);
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
  public getCanton(): any {
    if (this.formaDirecciones.value.Provincia !== '') {
      this.direccionesService.getCanton(this.formaDirecciones.value.Provincia)
        .pipe(map(data => data["CANTON"]))
        .subscribe((data: any) => {
          this.cantones = data;
        });
    }
  }

  public getParroquia(): any {

    if (this.formaDirecciones.value.Canton !== '') {
      this.direccionesService.getParroquia(this.formaDirecciones.value.Canton)
        .pipe(map(data => data["PARROQUIA"]))
        .subscribe((data: any) => {
          this.parroquias = data;
        });
    }
  }

  public getBarrio(): any {
    if (this.formaDirecciones.value.Parroquia !== '') {
      this.direccionesService.getBarrio(this.formaDirecciones.value.Parroquia)
        .pipe(map(data => data["BARRIO"]))
        .subscribe((data: any) => {
          this.barrios = data;
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
      });
  }

  public getDirecciones(): any {
    this.direccionesService.getDirecciones(this.mensajeServicio.Cedula, this.mensajeServicio.NumeroCredito, this.mensajeServicio.Cedula)
      .pipe(map(data => data["DIRECCIONES"]))
      .subscribe((data: any) => {
        this.direcciones = data;
      });
  }

  public getSituacionFinancieraIngresos(): any {
    this.situacionFinancieraService.getIngresos('AC0101045')
      .pipe(map(data => data["INGRESOS"]))
      .subscribe((data: any) => {
        this.situacionFinancieraIngresos = data;
        console.log(this.situacionFinancieraIngresos);
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

  get valorArriendosNoValida() {
    return this.formaSituacionFinanciera.get('valorArriendos').invalid && this.formaSituacionFinanciera.get('valorArriendos').touched;
  }

  crearFormularioSituacionFinanciera() {
    this.formaSituacionFinanciera = this.fb.group( {
      valorArriendos: ['0', [Validators.minLength(6)]],
      comentarioArriendos: [''],
      valorHonorarios: ['0',[Validators.minLength(6), Validators.pattern('^[0-9]*$')]],
      comentarioHonorarios: [''],
      valorOtrosIngresos1: ['0'],
      comentarioOtrosIngresos1: [''],
      valorOtrosIngresos2: ['0'],
      comentarioOtrosIngresos2: [''],
      valorOtrosIngresos3: ['0'],
      comentarioOtrosIngresos3: [''],
      valorSueldoConyuge: ['0'],
      comentarioSueldoConyuge: [''],
      valorSueldoMensual: ['0'],
      comentarioSueldoMensual: [''],
      valorUtilidadMensual: ['0'],
      comentarioUtilidadMensual: [''],
    });
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

  cargarFormularioSituacionFinanciera(situacionFinancieraIngresos: any) {
    this.formaSituacionFinanciera.reset( {
      valorArriendos: situacionFinancieraIngresos[0].VALOR_CREDITO_INGRESOS,
      comentarioArriendos: situacionFinancieraIngresos[0].COMENTARIO_CREDITO_INGRESOS
    });
  }

  cargarFormularioDirecciones(direccion: any) {

    this.codigoDireccion = direccion["ID_DIR"];
    this.formaDirecciones.reset({
      tipoRegistro: direccion.TipoRegistro.toUpperCase(),
      tipoDireccion: direccion.COD_TDIR.toUpperCase(),
      Provincia: direccion.COD_PROV,
      Canton: direccion.COD_CAN,
      Parroquia: direccion.COD_PAR,
      Barrio: direccion.COD_BAR,
      CallePrincipal: direccion.PRINC_DIR,
      NumeroCalle: direccion.NUM_DIR,
      CalleSecundaria: direccion.SECUN_DIR,
      ReferenciaDireccion: direccion.REFER_DIR,
      CodigoPostalDireccion: direccion.COD_POSTAL_DIR
    });
    this.getCanton();
    this.formaDirecciones.value.Canton = direccion.COD_CAN.toUpperCase();
    this.getParroquia();
    this.formaDirecciones.value.Parroquia = direccion.COD_PAR.toUpperCase();
    this.getBarrio();
    this.formaDirecciones.value.Barrio = direccion.COD_BAR.toUpperCase();
  }

  cargarFormularioTelefonos(telefono: any) {
    this.formaTelefonos.reset({
      TipoRegistroTelefono: telefono.TIPO.toUpperCase(),
      TipoTelefono: telefono["COD_TDIS"],
      CodigoTelefono: telefono.VALOR_DIS.substring(0, 2),
      NumeroTelefono: telefono.VALOR_DIS.substring(2, telefono.VALOR_DIS.length),
      ExtensionTelefono: telefono["EXTEN_DIS"]
    });
    this.codigoTelefono = telefono["ID_DIS"];
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
      direccion.ID_DIR = this.codigoDireccion;
      this.direccionesService.postDireccion(direccion, this.crearDireccion).subscribe(
        (data: any) => {
          if (data.resultado !== null) {
            this.modalService.dismissAll();
            this.direcciones = this.getDirecciones();
            this.successMessage = 'Información guardada!';
          }
        }
      );
    }
  }

  guardarTelefono() {
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
                                        this.formaTelefonos.value.ExtensionTelefono, this.codigoTelefono, this.crearTelefono).subscribe(
        (data: any) => {
          if (data.error !== null) {
            console.log(data.error);
          } else {
            this.modalService.dismissAll();
            this.telefonos = this.getTelefonos();
            this.successMessage = 'Información guardada!';
          }
        }, (errorServicio) => {
          console.log('Error');
        }
      );
    }
  }
}

