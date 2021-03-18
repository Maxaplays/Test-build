import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Direccion, DireccionesService} from '../../services/direcciones/direcciones.service';
import {TelefonosService} from '../../services/telefonos/telefonos.service';
import {debounceTime, map} from 'rxjs/operators';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { TipoDocumentacionService } from '../../services/tipo-documentacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SituacionFinancieraService } from '../../services/situacionFinanciera/situacion-financiera.service';
import { ConyugesService, Conyuge } from 'src/app/services/conyuges/conyuges.service';
import { ReferenciasService, Referencia } from 'src/app/services/referencias/referencias.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subject } from 'rxjs';
import { GeneroService } from 'src/app/services/genero/genero.service';
import { NacionalidadesService } from 'src/app/services/nacionalidades/nacionalidades.service';
import { EstadoCivilService } from 'src/app/services/estadoCivil/estado-civil.service';
import { ProfesionService } from 'src/app/services/profesion/profesion.service';
import { ClienteService, Cliente } from 'src/app/services/cliente/cliente.service';
import { DatosComplementariosService, CREDITO_DATOS_COMPLEMENTARIOS } from '../../services/datosComplementarios/datos-complementarios.service';
import { ParentescoService } from 'src/app/services/parentesco/parentesco.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { DocumentosService } from 'src/app/services/documentos.service';


@Component({
  selector: 'app-content-fabrica-solicitud-credito',
  templateUrl: './content-fabrica-solicitud-credito.component.html',
  styleUrls: ['./content-fabrica-solicitud-credito.component.css']
})
export class ContentFabricaSolicitudCreditoComponent implements OnInit {

  // @ts-ignore

  @ViewChild('fileInput') fileInput;
  closeResult: string;
  private _error = new Subject<string>();
  private _success = new Subject<string>();
  paginaActual = 1;
  staticAlertClosed = false;
  errorMessage: string;
  successMessage: string;
  advertenceMessage: string;
  loading: boolean;
  // bkm
  mensajeServicio: DatosFabrica;
  crearDireccion = true;
  crearTelefono = true;
  crearReferencia = true;
  codigoDireccion: 0;
  codigoTelefono: 0;
  sumatoriaIngresos: number = 0;
  sumatoriaEgresos: number = 0;
  sumatoriaTotal: number = 0;
  sumatoriaActivos: number = 0;
  TMueble: number = 0;
  CMuebles: string;
  TPropiedades: number = 0;
  CPropiedades: string;
  TVehiculos: number = 0;
  CVehiculos: string;
  TInversiones: number = 0;
  CInversiones: string;
  TAcciones: number = 0;
  CAcciones: string;
  TotalActivos: number = 0;
  TDeudas: number = 0;
  CDeudas: string;
  TTarjetas: number = 0;
  CTarjetas: string;
  TotalPasivos: number = 0;
  TotalPatrimonio: number = 0;
  idCredito: string;
  referenciaID_REFeditable: string = '';
  conyugeID_CONeditable: string = '';
  tabActual;
  btnSolicitarAnulacion = true;
  BtnEntregarCarpeta = false;
  btnSolicitarAnalisis = true;
  btnMedioAprobacion = true;
  ASPxActualizarSOL = true;
  btnTelefonos = true;
  btnActualizarDirecciones = true;
  btnConyuge = true;
  btnActualizarReferencias = true;
  grabarDatosIngresadosGrid = true;
  SubirArchivos = true;
  Detalle_Dependiente: string;
  Detalle_Independiente: string;
  // formas para ingreso y edición de datos - bkm
  formaDirecciones: FormGroup;
  formaTelefonos: FormGroup;
  formaEntregarCarpeta: FormGroup;
  FormularioDatosReferencia: FormGroup;
  FormularioDatosCliente: FormGroup;
  formaSituacionFinanciera: FormGroup;
  FormularioDatosConyuge: FormGroup;
  @Input() idCre: string;

  // variables para presentacion - bkm
  tipoDir: any[] = [];
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];
  barrios: any[] = [];
  tipoTel: any[] = [];
  telefonos: any[] = [];
  direcciones: any[] = [];
  referencias: any[] = [];
  tipoDoc: any[];
  generos: any[];
  parentescos: any[];
  nacionalidades: any[];
  estadoCivil: any = []; // tipos de estados civiles para el combo
  profesiones: any = [];
  tipoRegDir: any[] = ['CLIENTE', 'GARANTE'];
  tipoRegTel: any[] = ['CLIENTE', 'GARANTE'];
  situacionFinancieraIngresos: any[] = [];
  situacionFinancieraEgresos: any[] = [];
  detalle_ingresos: any;
  situacionFinancieraTotalPatrimonio: any[] = [];
  situacionFinancieraMuebles: any[] = [];
  documentosSubidos: any[] = [];
  total: number;
  conyuges: Conyuge[] = [];
  datosComplemetarios: CREDITO_DATOS_COMPLEMENTARIOS[] = [];
  Archivos: File[] = [];
  archivoSeleccionado: File = null;
  nombreArchivo: string = '';

  // bkm
  // tslint:disable-next-line:max-line-length
  constructor(private modalService: NgbModal,
              private direccionesService: DireccionesService,
              private telefonoService: TelefonosService,
              private fabricaService: FabricaService,
              private tipoDocumentacionService: TipoDocumentacionService,
              private conyugesServices: ConyugesService,
              private referenciasServices: ReferenciasService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private situacionFinancieraService: SituacionFinancieraService,
              private generoService: GeneroService,
              private parentescoServices: ParentescoService,
              private nacionalidadesService: NacionalidadesService,
              private estadoCivilService: EstadoCivilService,
              private profesionService: ProfesionService,
              private clienteService: ClienteService,
              private datosComplService: DatosComplementariosService,
              private documentosService: DocumentosService,
              private router: Router) {
  }

  ngOnInit() {
    this.crearFormularioCliente();
    this.crearFormularioDirecciones();
    this.crearFormularioEntregarCarpeta();
    this.crearFormularioTelefonos();
    this.crearFormularioSituacionFinanciera();
    this.crearFormularioConyuge();
    this.crearFormularioReferencia();
    this.tipoDoc = this.getTipoDoc();
    this.getGeneros();
    this.getNacionalidades();
    this.getParentescos();
    this.getEstadoCivil();
    this.getProfesiones();
    this.tipoDir = this.getTipoDir();
    this.provincias = this.getProvincia();
    this.cantones = this.getCanton();
    this.barrios = this.getBarrio();
    this.tipoTel = this.getTipoTel();

    if (this.idCre !== undefined && this.idCre !== '') {
      this.idCredito = this.idCre;
      // console.log('Solicitud de credito:' + this.idCredito);
      if (typeof this.idCredito !== 'undefined') {
            this.fabricaService.getRetomarCredito(this.idCredito,
              localStorage.getItem('usuario')).pipe(map (data => data['Table1'][0])).subscribe(
                (data: DatosFabrica) => {
                  // console.log(data);
                  this.fabricaService.changeMessage(data);
                  // console.log('Acoplar Pantalla: ' + data.Estado);
                  // this.acoplarPantalla(data.Estado);
                });
      }
    }
    this.fabricaService.currentMessage.subscribe(
        data => {
        this.mensajeServicio = data;
        this.getCliente();
        this.getDatosComplementarios();
        this.direcciones = this.getDirecciones();
        this.telefonos = this.getTelefonos();
        this.conyuges = this.getListaConyuges();
        this.referencias = this.getListaReferencias();
        this.situacionFinancieraIngresos = this.getSituacionFinancieraIngresos();
        this.situacionFinancieraEgresos = this.getSituacionFinancieraEgresos();
        this.situacionFinancieraTotalPatrimonio = this.getSituacionFinancieraTotalPatrimonio();
        this.acoplarPantalla(data.Estado);
        this.getDetalles();
      });
  }
  incializarCredito() {
    this.loading = true;
    this.fabricaService.getRetomarCredito(this.idCredito,
    localStorage.getItem('usuario')).pipe(map (data => data['Table1'][0])).subscribe(
              (data: DatosFabrica) => {
                // console.log(data);
                // console.log('Acoplar Pantalla estado:' + data.Estado);
                this.fabricaService.changeMessage(data);
                this.acoplarPantalla(data.Estado);
                this.getCliente();
                this.getDatosComplementarios();
                this.direcciones = this.getDirecciones();
                this.telefonos = this.getTelefonos();
                this.conyuges = this.getListaConyuges();
                this.referencias = this.getListaReferencias();
                this.situacionFinancieraIngresos = this.getSituacionFinancieraIngresos();
                this.situacionFinancieraEgresos = this.getSituacionFinancieraEgresos();
                this.situacionFinancieraTotalPatrimonio = this.getSituacionFinancieraTotalPatrimonio();
                this.loading = false;
              });
  }
  onDatosComplementariosComentariosChange(newValue, ID_CREDITO_COMPLEMENTARIOS: string) {
    if (this.grabarDatosIngresadosGrid) {
    this.datosComplService.getguardarComentario(ID_CREDITO_COMPLEMENTARIOS, newValue, localStorage.getItem('usuario'))
        .subscribe( (resultado: any[] ) => {
            if (resultado.toString() === 'Actualizado!') {
              // this.successMessage = resultado.toString();
              // this.getDatosComplementarios();
            }
        });
      }
  }
  crearFormularioCliente() {
    this.FormularioDatosCliente = new FormGroup({
      tipoDocumentacion: new FormControl(null),
      cedula: new FormControl(null),
      nombreCliente: new FormControl(null, Validators.required),
      apellidoCliente: new FormControl(null, Validators.required),
      fechaNacimiento: new FormControl(null),
      genero: new FormControl(null),
      nacionalidad: new FormControl(null),
      estadoCivil: new FormControl(null),
      cargasFamiliares: new FormControl(null),
      emailCliente: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      profesionCliente: new FormControl(null),
      rucTrabajo: new FormControl(null),
      razonSocialTrabajo: new FormControl(null)
    });
  }

  getCliente() {
    if (this.mensajeServicio.Cedula !== '' && this.mensajeServicio.Cedula !== undefined) {
      this.clienteService.getClienteCedula(this.mensajeServicio.Cedula)
      .pipe(map(data => data['CLIENTE']))
      .subscribe((data: any) => {
        let datosCliente: Cliente;
        datosCliente = data[0];
        // console.log(data[0]);
        this.FormularioDatosCliente.controls['genero'].setValue(datosCliente.COD_GEN);
        this.FormularioDatosCliente.controls['estadoCivil'].setValue(datosCliente.COD_ECIV);
        this.FormularioDatosCliente.controls['profesionCliente'].setValue(datosCliente.COD_PRO);
        this.FormularioDatosCliente.controls['tipoDocumentacion'].setValue(datosCliente.COD_TDOC);
        this.FormularioDatosCliente.controls['nacionalidad'].setValue(datosCliente.COD_NAC);
        this.FormularioDatosCliente.controls['apellidoCliente'].setValue(datosCliente.APE_CLI);
        this.FormularioDatosCliente.controls['nombreCliente'].setValue(datosCliente.NOM_CLI);
        try {
        let fechaNacimiento: Date = new Date(datosCliente.FECH_NAC_CLI);
        this.FormularioDatosCliente.controls['fechaNacimiento'].setValue(fechaNacimiento.toISOString().substring(0, 10));
        } catch {}
        this.FormularioDatosCliente.controls['cargasFamiliares'].setValue(datosCliente.CARGAS_CLI);
        this.FormularioDatosCliente.controls['razonSocialTrabajo'].setValue(datosCliente.EMP_CLI);
        this.FormularioDatosCliente.controls['rucTrabajo'].setValue(datosCliente.RUC_EMP_CLI);
        this.FormularioDatosCliente.controls['emailCliente'].setValue(datosCliente.EMAIL_CLI);
      });
    }
  }

  guardarCliente(content) {
    if (this.FormularioDatosCliente.valid) {
      this.situacionFinancieraIngresos = this.getSituacionFinancieraIngresos();
      this.situacionFinancieraEgresos = this.getSituacionFinancieraEgresos();
      this.situacionFinancieraTotalPatrimonio = this.getSituacionFinancieraTotalPatrimonio();
      this.getDatosComplementarios();
      let datosCliente: Cliente = new Cliente();
      let resultado: string;
      datosCliente.ID_CLI = this.mensajeServicio.Cedula;
      datosCliente.COD_GEN = this.FormularioDatosCliente.value.genero;
      datosCliente.COD_ECIV = this.FormularioDatosCliente.value.estadoCivil;
      datosCliente.COD_PRO = this.FormularioDatosCliente.value.profesionCliente;
      datosCliente.COD_TDOC = this.FormularioDatosCliente.value.tipoDocumentacion;
      datosCliente.COD_NAC = this.FormularioDatosCliente.value.nacionalidad;
      datosCliente.APE_CLI = this.FormularioDatosCliente.value.apellidoCliente;
      datosCliente.NOM_CLI = this.FormularioDatosCliente.value.nombreCliente;
      try {
        // console.log('Estado Civil: ' + this.FormularioDatosCliente.value.estadoCivil);
        // console.log('Fecha de Nacimiento: ' + this.FormularioDatosCliente.value.fechaNacimiento);
        let fechaNacimiento: Date = new Date(this.FormularioDatosCliente.value.fechaNacimiento);
        // console.log("fecha de nacimiento convertida: " + fechaNacimiento.toISOString().substring(0, 10));
        datosCliente.FECH_NAC_CLI = fechaNacimiento.toISOString().substring(0, 10);
      } catch {
      }
      datosCliente.CARGAS_CLI = this.FormularioDatosCliente.value.cargasFamiliares;
      datosCliente.EMP_CLI = this.FormularioDatosCliente.value.razonSocialTrabajo;
      datosCliente.RUC_EMP_CLI = this.FormularioDatosCliente.value.rucTrabajo;
      datosCliente.EMAIL_CLI = this.FormularioDatosCliente.value.emailCliente;
      datosCliente.EstadoOperacion = '';
      datosCliente.INGRESOS_DEPENDIENTE = '0';
      datosCliente.INGRESOS_INDEPENDIENTE = '0';
      datosCliente.usuario = localStorage.getItem('usuario');
      datosCliente.credito = this.mensajeServicio.NumeroCredito;

      if (this.mensajeServicio.NombreConsultado === datosCliente.APE_CLI.trim() + ' ' + datosCliente.NOM_CLI.trim()) {
        this.clienteService.postCliente(datosCliente).subscribe(
          (data: any) => {
            resultado = data;
            if (resultado === 'Cliente ingresado exitosamente!') {
              this.successMessage = 'Guardado Exitosamente!';
            } else {
              // Error
              this.errorMessage = data;
              this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
            }
          });
      } else {
        this.errorMessage = 'Datos de cliente incorrectos, favor revise';
        this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
        return Object.values(this.FormularioDatosCliente.controls).forEach(control => {
          if (control instanceof FormGroup) {
            // tslint:disable-next-line:no-shadowed-variable
            Object.values(control.controls).forEach(control => control.markAllAsTouched());
          } else {
            control.markAllAsTouched();
          }
        });
      }
    }
  }

  editarConyuge(content, conyuge: Conyuge) {
    if (conyuge === undefined) {
      this.crearFormularioConyuge();
      this.conyugeID_CONeditable = '';
      // console.log('dato:' + this.conyugeID_CONeditable);
    } else {
      this.cargarFormularioConyuge(conyuge);
      this.conyugeID_CONeditable = conyuge.ID_CON;
      // console.log('dato:' + this.conyugeID_CONeditable);
    }
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  crearFormularioConyuge() {
    this.FormularioDatosConyuge = new FormGroup({
      tipo_registro: new FormControl(null),
      tipoDocumentacion: new FormControl(null, Validators.required),
      cedula: new FormControl(null, Validators.required),
      apellidoConyuge: new FormControl(null, Validators.required),
      nombreConyuge: new FormControl(null, Validators.required),
      telefonoConyuge: new FormControl(null, Validators.pattern('^[0-9]*$')),
      fechaNacimiento: new FormControl(null, Validators.required),
      genero: new FormControl(null),
      nacionalidad: new FormControl(null),
      profesion: new FormControl(null),
      direccion: new FormControl(null),
      observaciones: new FormControl(null)
    });
  }
  cargarFormularioConyuge(conyuge: Conyuge) {
    let fechaNacimientostring: string = '';
    try {
      let fechaNacimiento: Date = new Date(conyuge.FECH_NAC_CON);
      fechaNacimientostring = fechaNacimiento.toISOString().substring(0, 10);
      } catch {
      }
    this.FormularioDatosConyuge.reset({
      tipo_registro: 'CLIENTE',
      tipoDocumentacion: conyuge.COD_TDOC,
      cedula: conyuge.CED_CON,
      apellidoConyuge: conyuge.APE_CON,
      nombreConyuge: conyuge.NOM_CON,
      telefonoConyuge: conyuge.telefono,
      fechaNacimiento: fechaNacimientostring,
      genero: conyuge.COD_GEN,
      nacionalidad: conyuge.COD_NAC,
      profesion: conyuge.COD_PRO,
      direccion: conyuge.DIR_TRAB_CON,
      observaciones: conyuge.OBSERVACIONES_CON
    });
  }

  editarReferencia(content, referencia: any) {
    if (referencia === undefined || referencia === '') {
      this.crearFormularioReferencia();
      this.referenciaID_REFeditable = '';
      // console.log('dato:' + this.referenciaID_REFeditable);
    } else {
      this.cargarFormularioReferencia(referencia);
      this.referenciaID_REFeditable = referencia.ID_REF;
      // console.log('dato:' + this.referenciaID_REFeditable);
    }
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  crearFormularioReferencia() {
    this.FormularioDatosReferencia = new FormGroup({
      tipo_registro: new FormControl(null),
      cedula: new FormControl(null),
      parentesco: new FormControl(null, Validators.required),
      apellido: new FormControl(null, Validators.required),
      nombre: new FormControl(null, Validators.required),
      direccion: new FormControl(null),
      telefono_dom: new FormControl(null, [Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]),
      celular: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
      telefono_trab: new FormControl(null, [Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]),
      empresa: new FormControl(null),
      direc_emp: new FormControl(null),
      observa_ref: new FormControl(null),
      email: new FormControl(null),
     });
  }

  cargarFormularioReferencia(referencia: any) {
    this.FormularioDatosReferencia.reset({
      tipo_registro: 'Cliente',
      cedula: referencia.cedula,
      parentesco: referencia.COD_PARE,
      apellido: referencia.apellido,
      nombre: referencia.nombre,
      direccion: referencia.direccion,
      telefono_dom: referencia.telefono_dom,
      celular: referencia.celular,
      telefono_trab: referencia.telefono_trab,
      empresa: referencia.empresa,
      direc_emp: referencia.direc_emp,
      observa_ref: referencia.observa_ref,
      email: referencia.email,
    });
  }
    // cedula, apellido, nombre, direccion, telefono_dom, celular, telefono_trab, empresa, direc_emp, observa
  guardarReferencia(content) {
    // console.log('Inicia Proceso');
    if (this.FormularioDatosReferencia.valid) {
      const datosReferencia: Referencia = new Referencia();
      datosReferencia.cedula = this.FormularioDatosReferencia.value.cedula;
      datosReferencia.parentesco = this.FormularioDatosReferencia.value.parentesco;
      datosReferencia.apellido = this.FormularioDatosReferencia.value.apellido;
      datosReferencia.nombre = this.FormularioDatosReferencia.value.nombre;
      datosReferencia.direccion = this.FormularioDatosReferencia.value.direccion;
      datosReferencia.telefono_dom = this.FormularioDatosReferencia.value.telefono_dom;
      datosReferencia.celular = this.FormularioDatosReferencia.value.celular;
      datosReferencia.telefono_trab = this.FormularioDatosReferencia.value.telefono_trab;
      datosReferencia.empresa = this.FormularioDatosReferencia.value.empresa;
      datosReferencia.direc_emp = this.FormularioDatosReferencia.value.direc_emp;
      datosReferencia.observa_ref = this.FormularioDatosReferencia.value.observa_ref;
      datosReferencia.email = this.FormularioDatosReferencia.value.email;
      datosReferencia.cliente = this.mensajeServicio.Cedula;
      datosReferencia.ID_REF = this.referenciaID_REFeditable;


      this.referenciasServices.postReferencias(datosReferencia, this.crearReferencia).subscribe(
        (data: any) => {
          let resultado = data;
          // console.log(data);
          if (resultado.resultado === 'Referencia ingresada') {
            this.modalService.dismissAll();
            this.successMessage = 'Referencia Guardado Exitosamente!';
            this.getListaReferencias();
          } else {
            // Error
            this.errorMessage = data.error;
            this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
          }
        });
      } else {
        this.errorMessage = 'Datos de referencia incorrectos, favor revise';
        this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
        return Object.values(this.FormularioDatosReferencia.controls).forEach(control => {
          if (control instanceof FormGroup) {
            // tslint:disable-next-line:no-shadowed-variable
            Object.values(control.controls). forEach( control => control.markAllAsTouched());
          } else {
            control.markAllAsTouched();
          }
        });
      }
  }

  public getTipoDoc(): any {
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

  openLgEntregarCarpeta(content) {
    this.modalService.open(content);
  }

  openLgDocumentacion(content) {
    this.getDocumentosCredito();
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
  getDatosComplementarios(): any {
    this.datosComplService.getDatosComplementarios(this.mensajeServicio.NumeroCredito)
    .subscribe(
      (data: any) => {
        this.datosComplemetarios = data;
        // console.log(this.estadoCivil);
      }, ( errorServicio ) => {
        // console.log('Error');
      }
    );
  }
  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }

  getTipoDir(): any {
    this.direccionesService.getTipoDir()
      .pipe(map (data => data['TIPODIR']))
      .subscribe((data: any) => {
        this.tipoDir = data;
      });
  }

  public getProvincia(): any {
    this.direccionesService.getProvincia()
      .pipe(map (data => data['PROVINCIA']))
      .subscribe((data: any) => {
        this.provincias = data;
      });
  }
  getGeneros() {
    this.generoService.getGeneros()
      .pipe(map (data => data['GENERO']))
      .subscribe((data: any) => {
        this.generos = data;
      });
  }

  getParentescos() {
    this.parentescoServices.getParentescos()
    .pipe(map (data => data['PARENTESCO']))
    .subscribe((data: any) => {
      this.parentescos = data;
    });
  }

  getNacionalidades() {
    this.nacionalidadesService.getNacionalidades()
      .pipe(map (data => data['NACIONALIDAD']))
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
        .pipe(map(data => data['CANTON']))
        .subscribe((data: any) => {
          this.cantones = data;
        });
    }
  }

  public getParroquia(): any {

    if (this.formaDirecciones.value.Canton !== '') {
      this.direccionesService.getParroquia(this.formaDirecciones.value.Canton)
        .pipe(map(data => data['PARROQUIA']))
        .subscribe((data: any) => {
          this.parroquias = data;
        });
    }
  }

  public getBarrio(): any {
    if (this.formaDirecciones.value.Parroquia !== '') {
      this.direccionesService.getBarrio(this.formaDirecciones.value.Parroquia)
        .pipe(map(data => data['BARRIO']))
        .subscribe((data: any) => {
          this.barrios = data;
        });
    }
  }
  acoplarPantalla(lblEstadoSolicitud: string) {
    if (lblEstadoSolicitud === undefined) {
      return;
    }
    if (lblEstadoSolicitud === 'Documental' || lblEstadoSolicitud === 'Cancelada' ||
        lblEstadoSolicitud === 'Aprobada' || lblEstadoSolicitud === 'Autorizada' ||
        lblEstadoSolicitud === 'Re-Documental' || lblEstadoSolicitud === 'RechazadaCC' ||
        lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Caducada' ||
        lblEstadoSolicitud === 'Perfil No Aprobado' || lblEstadoSolicitud === 'Retornada' ||
        lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'Rechazada' ||
        lblEstadoSolicitud === 'Autorización Caducada' || lblEstadoSolicitud === 'Consultada' ||
        lblEstadoSolicitud === 'Ingresando' || lblEstadoSolicitud === 'Verificando' || lblEstadoSolicitud === 'Devuelta' ||
        lblEstadoSolicitud === 'Re-verificación' || lblEstadoSolicitud === 'Guardada') {
                    // pageControlCliente.TabPages[7].Enabled = true;
                    if (lblEstadoSolicitud === 'Aprobada') {
                      // console.log('Bloqueado 1' + lblEstadoSolicitud);
                      this.btnSolicitarAnulacion = false;
                      this.BtnEntregarCarpeta = true;
                      this.btnSolicitarAnalisis = false;
                      this.btnMedioAprobacion = false;
                      this.grabarDatosIngresadosGrid = false;
                      this.SubirArchivos = false;
                    } else {
                        if (lblEstadoSolicitud === 'Ingresando') {
                          // console.log('Bloqueado 1' + lblEstadoSolicitud);
                          this.btnSolicitarAnulacion = true;
                          this.BtnEntregarCarpeta = false;
                          this.btnSolicitarAnalisis = true;
                          this.btnMedioAprobacion = true;
                          this.grabarDatosIngresadosGrid = true;
                          this.SubirArchivos = true;
                          this.ASPxActualizarSOL = true;
                        } else {
                          if (lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Rechazada' ||
                           lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'RechazadaCC' ||
                            lblEstadoSolicitud === 'Caducada' || lblEstadoSolicitud === 'Autorización Caducada' ||
                            lblEstadoSolicitud === 'Consultada') {
                              // this.pestaniasIngreso.controls['selectTabs'].setValue('Políticas');
                              // ('Bloqueado 2' + lblEstadoSolicitud);
                              this.btnSolicitarAnulacion = false;
                              this.BtnEntregarCarpeta = false;
                              //this.ASPxButton1 = false;
                              this.ASPxActualizarSOL = false;
                              this.btnTelefonos = false;
                              this.btnActualizarDirecciones = false;
                              this.btnConyuge = false;
                              this.btnActualizarReferencias = false;
                              this.grabarDatosIngresadosGrid = false;
                              this.SubirArchivos = false;
                              this.btnSolicitarAnalisis = false;
                              // ASPxUploadControl1.Visible = false;
                              // ASPxUploadControl2.Visible = false;
                              // ASPxUploadControl3.Visible = false;
                              // btnGenerarReportesDinamicos.Visible = false;
                              // btnRefrescar.Visible = false;
                              // BtnGuardar.Visible = false;
                              this.btnSolicitarAnalisis = false;
                              this.btnMedioAprobacion = false;
                          } else {
                              if (lblEstadoSolicitud === 'Cancelada' ) {
                                // console.log('Bloqueado 3' + lblEstadoSolicitud);
                                this.ASPxActualizarSOL = false;
                                this.btnSolicitarAnulacion = false;
                                this.BtnEntregarCarpeta = false;
                                this.btnSolicitarAnalisis = false;
                                this.btnMedioAprobacion = false;
                                this.btnTelefonos = false;
                                this.btnActualizarDirecciones = false;
                                this.btnConyuge = false;
                                this.btnActualizarReferencias = false;
                                this.grabarDatosIngresadosGrid = false;
                                this.SubirArchivos = false;
                              } else {
                                // console.log('Bloqueado 4' + lblEstadoSolicitud);
                                // this.btnSolicitarAnulacion = true;
                                // this.BtnEntregarCarpeta = false;
                                // this.btnSolicitarAnalisis = false;
                                // this.grabarDatosIngresadosGrid = false;
                                // this.SubirArchivos = false;
                              }
                          }
                      }
                    }
                } else {
                  // console.log('Bloqueado 5' + lblEstadoSolicitud);
                  this.btnSolicitarAnulacion = false;
                  this.BtnEntregarCarpeta = false;
                  this.btnSolicitarAnalisis = false;
                  this.btnMedioAprobacion = false;
                  this.grabarDatosIngresadosGrid = false;
                  this.SubirArchivos = false;
                  this.ASPxActualizarSOL = false;
                  this.btnTelefonos = false;
                  this.btnActualizarDirecciones = false;
                  this.btnConyuge = false;
                  this.btnActualizarReferencias = false;
                }
  }
  public getTipoTel(): any {
    this.telefonoService.getTipoTelefonos()
      .pipe(map(data => data['TIPTEL']))
      .subscribe((data: any) => {
        this.tipoTel = data;
      });
  }

  public getTelefonos(): any {
    this.telefonoService.getTelefonos(this.mensajeServicio.Cedula)
      .pipe(map(data => data['TELEFONOS']))
      .subscribe((data: any) => {
        this.telefonos = data;
      });
      
  }
  // SITUACION FINANCIERA DDLT
  onDatosIngresosChange(newValue, ID_CREDITO_INGRESOS: string) {
    if (this.grabarDatosIngresadosGrid) {
    this.situacionFinancieraService.getguardarComentarioIngresos(ID_CREDITO_INGRESOS, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
          // console.logconsole.log(resultado);
          let totalSumaBackend: number;
          totalSumaBackend = Number(resultado.toString().replace(',', '.'));
          this.sumatoriaIngresos = totalSumaBackend;
          this.sumatoriaTotal = this.sumatoriaIngresos - this.sumatoriaEgresos;

      });
    }
  }
  onDatosIngresosValorChange(newValue, ID_CREDITO_INGRESOS: string) {
    if (this.grabarDatosIngresadosGrid) {
    this.situacionFinancieraService.getguardarValorIngresos(ID_CREDITO_INGRESOS, newValue, localStorage.getItem('usuario'))
     .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.sumatoriaIngresos = totalSumaBackend;
        this.sumatoriaTotal = this.sumatoriaIngresos - this.sumatoriaEgresos;
        this.getDetalles();
     });
    }
  }
  onDatosEgresosChange(newValue, ID_CREDITO_EGRESOS: string) {
    if (this.grabarDatosIngresadosGrid) {
    this.situacionFinancieraService.getguardarComentarioEgresos(ID_CREDITO_EGRESOS, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.sumatoriaEgresos = totalSumaBackend;
        this.sumatoriaTotal = this.sumatoriaIngresos - this.sumatoriaEgresos;
      });
    }
  }
  onDatosEgresosValorChange(newValue, ID_CREDITO_EGRESOS: string) {
    if (this.grabarDatosIngresadosGrid) {
    this.situacionFinancieraService.getguardarValorEgresos(ID_CREDITO_EGRESOS, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.sumatoriaEgresos = totalSumaBackend;
        this.sumatoriaTotal = this.sumatoriaIngresos - this.sumatoriaEgresos;
        this.getDetalles();
      });
    }
  }
// Activos y Pasivos
  onDatosMueblesValorChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      // console.log(newValue);
      if (newValue == null) {
        newValue = 0;
        this.TMueble = 0;
      }
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarValorMuebles(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.TotalActivos = totalSumaBackend;
        this.TotalPatrimonio = this.TotalActivos - this.TotalPasivos;
      });
    }
  }

  onDatosMueblesComentarioChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      // console.log( 'Este mensaje es de comentario: ' + newValue);
      this.situacionFinancieraService.getguardarComentarioMuebles(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
      });
    }
  }

  onDatosPropiedadesValorChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarValorPropiedades(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.TotalActivos = totalSumaBackend;
        this.TotalPatrimonio = this.TotalActivos - this.TotalPasivos;
      });
    }
  }

  onDatosPropiedadesComentarioChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarComentarioPropiedades(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
      });
    }
  }

  onDatosVehiculosValorChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarValorVehiculos(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.TotalActivos = totalSumaBackend;
        this.TotalPatrimonio = this.TotalActivos - this.TotalPasivos;
      });
    }
  }

  onDatosVehiculosComentarioChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarComentarioVehiculos(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
      });
    }
  }

  onDatosInversionesValorChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarValorInversiones(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.TotalActivos = totalSumaBackend;
        this.TotalPatrimonio = this.TotalActivos - this.TotalPasivos;
      });
    }
  }

  onDatosInversionesComentarioChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarComentarioInversiones(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
      });
    }
  }

  onDatosAccionesValorChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarValorAcciones(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.TotalActivos = totalSumaBackend;
        this.TotalPatrimonio = this.TotalActivos - this.TotalPasivos;
      });
    }
  }

  onDatosAccionesComentarioChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarComentarioAcciones(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
      });
    }
  }

  onDatosDeudasValorChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarValorDeudas(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.TotalPasivos = totalSumaBackend;
        this.TotalPatrimonio = this.TotalActivos - this.TotalPasivos;
      });
    }
  }

  onDatosDeudasComentarioChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarComentarioDeudas(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
      });
    }
  }

  onDatosTarjetasValorChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarValorTarjetas(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
        let totalSumaBackend: number;
        totalSumaBackend = Number(resultado.toString().replace(',', '.'));
        this.TotalPasivos = totalSumaBackend;
        this.TotalPatrimonio = this.TotalActivos - this.TotalPasivos;
      });
    }
  }

  onDatosTarjetasComentarioChange(newValue) {
    if (this.grabarDatosIngresadosGrid) {
      let NumeroCredito: string;
      NumeroCredito =  this.mensajeServicio.NumeroCredito;
      this.situacionFinancieraService.getguardarComentarioTarjetas(NumeroCredito, newValue, localStorage.getItem('usuario'))
      .subscribe( (resultado: any ) => {
        // console.log(resultado);
      });
    }
  }

  getConyuge() {
    this.conyugesServices.getConyugeCedula(this.mensajeServicio.Cedula)
    .pipe(map(data => data['CONYUGE']))
    .subscribe((data: any) => {
      let datosConyuge: Conyuge;
      datosConyuge = data[0];
      // console.log(datosConyuge);
      this.FormularioDatosConyuge.controls['cedula'].setValue(datosConyuge.CED_CON);
      this.FormularioDatosConyuge.controls['genero'].setValue(datosConyuge.COD_GEN);
      this.FormularioDatosConyuge.controls['tipoDocumentacion'].setValue(datosConyuge.COD_TDOC);
      this.FormularioDatosConyuge.controls['apellidoConyuge'].setValue(datosConyuge.APE_CON);
      this.FormularioDatosConyuge.controls['nombreConyuge'].setValue(datosConyuge.NOM_CON);
      try{
      let fechaNacimiento: Date = new Date(datosConyuge.FECH_NAC_CON);
      this.FormularioDatosConyuge.controls['fechaNacimiento'].setValue(fechaNacimiento.toISOString().substring(0, 10));
      } catch {}
      this.FormularioDatosConyuge.controls['observaciones'].setValue(datosConyuge.OBSERVACIONES_CON);
      this.FormularioDatosConyuge.controls['direccion'].setValue(datosConyuge.DIR_TRAB_CON);
    });
  }

  public getDirecciones(): any {
    this.direccionesService.getDirecciones(this.mensajeServicio.Cedula, this.mensajeServicio.NumeroCredito, this.mensajeServicio.Cedula)
      .pipe(map(data => data['DIRECCIONES']))
      .subscribe((data: any) => {
        this.direcciones = data;
      });
  }

  public getSituacionFinancieraIngresos(): any {
    this.situacionFinancieraService.getIngresos(this.mensajeServicio.NumeroCredito)
      .pipe(map(data => data['INGRESOS']))
      .subscribe((data: any) => {
        this.situacionFinancieraIngresos = data;
        this.sumatoriaIngresos = 0;
        for ( var x in data){
          if (data[x].VALOR_CREDITO_INGRESOS != null) {
            this.sumatoriaIngresos = this.sumatoriaIngresos + data[x].VALOR_CREDITO_INGRESOS;
            this.sumatoriaTotal = this.sumatoriaIngresos - this.sumatoriaEgresos;
          }
        }
      });
  }
  public getSituacionFinancieraEgresos(): any {
    this.situacionFinancieraService.getEgresos(this.mensajeServicio.NumeroCredito)
      .pipe(map(data => data['EGRESOS']))
      .subscribe((data: any) => {
        this.situacionFinancieraEgresos = data;
        this.sumatoriaEgresos = 0;
        for ( var x in data){
          if (data[x].VALOR_CREDITO_EGRESOS != null) {
            this.sumatoriaEgresos = this.sumatoriaEgresos + data[x].VALOR_CREDITO_EGRESOS;
            this.sumatoriaTotal = this.sumatoriaIngresos - this.sumatoriaEgresos;
          }
        }
      });
  }
  public getDetalles(): any {
    if (this.mensajeServicio.NumeroCredito!==undefined && this.mensajeServicio.NumeroCredito!=='') {
      this.situacionFinancieraService.getDetalle(this.mensajeServicio.NumeroCredito)
        .pipe(map(data => data['DETALLE']))
        .subscribe((data: any) => {
          this.detalle_ingresos = data[0];
          this.Detalle_Dependiente = this.detalle_ingresos.INGRESOS_DEPENDIENTE;
          this.Detalle_Independiente = this.detalle_ingresos.INGRESOS_INDEPENDIENTE;
        });
    }
  }
  public getSituacionFinancieraTotalPatrimonio(): any {
    this.situacionFinancieraService.getTotalPatrimonio(this.mensajeServicio.NumeroCredito)
      .pipe(map(data => data['PATRIMONIO']))
      .subscribe((data: any) => {
        // console.log(data);
        if (data.length > 0) {
          this.situacionFinancieraTotalPatrimonio = data;
          this.TMueble = data[0].TMUEBLES;
          this.CMuebles = data[0].CMUEBLES;
          this.TPropiedades = data[0].TPROPIEDADES;
          this.CPropiedades = data[0].CPROPIEDADES;
          this.TVehiculos = data[0].TVEHICULOS;
          this.CVehiculos = data[0].CVEHICULOS;
          this.TInversiones = data[0].TINVERSIONES;
          this.CInversiones = data[0].CINVERSIONES;
          this.TAcciones = data[0].TACCIONES;
          this.CAcciones = data[0].CACCIONES;
          this.TotalActivos = data[0].TOTALACTIVOS;
          this.TDeudas = data[0].TDEUDAS;
          this.CDeudas = data[0].CDEUDAS;
          this.TTarjetas = data[0].TTARJETAS;
          this.CTarjetas = data[0].CTARJETAS;
          this.TotalPasivos = data[0].TOTALPASIVOS;
          this.TotalPatrimonio = data[0].TOTALPATRIMONIO;
        }
      });
  }

  guardarConyuge(content) {
    if (this.FormularioDatosConyuge.valid) {

    let datosConyuge: Conyuge = new Conyuge();
    let resultado: string;
    datosConyuge.ID_CLI = this.mensajeServicio.Cedula;
    datosConyuge.COD_GEN = this.FormularioDatosConyuge.value.genero;
    datosConyuge.CED_CON = this.FormularioDatosConyuge.value.cedula;
    datosConyuge.COD_TDOC = this.FormularioDatosConyuge.value.tipoDocumentacion;
    datosConyuge.APE_CON = this.FormularioDatosConyuge.value.apellidoConyuge;
    datosConyuge.NOM_CON = this.FormularioDatosConyuge.value.nombreConyuge;
    datosConyuge.telefono = this.FormularioDatosConyuge.value.telefonoConyuge.trim();
    datosConyuge.COD_NAC = this.FormularioDatosConyuge.value.nacionalidad;
    datosConyuge.COD_PRO = this.FormularioDatosConyuge.value.profesion;
    datosConyuge.OBSERVACIONES_CON = this.FormularioDatosConyuge.value.observaciones;
    datosConyuge.DIR_TRAB_CON = this.FormularioDatosConyuge.value.direccion;
    datosConyuge.ESTADO_CON = this.FormularioDatosConyuge.value.rucTrabajo;
    datosConyuge.usuario = localStorage.getItem('usuario');
    if (this.FormularioDatosConyuge.value.fechaNacimiento !== null) {
        try {
          // console.log("Fecha ingresada:" + this.FormularioDatosConyuge.value.fechaNacimiento);
          let fechaNacimiento: Date = new Date(this.FormularioDatosConyuge.value.fechaNacimiento);
          datosConyuge.FECH_NAC_CON = fechaNacimiento.toISOString().substring(0, 10);
        } catch { }
      } else {
        datosConyuge.FECH_NAC_CON = '';
    }
    if (datosConyuge.telefono !== '' && datosConyuge.telefono.length !== 10) {
      this.errorMessage = 'El Teléfono Móvil debe tener 10 dígitos';
      this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
    } else {
        this.conyugesServices.postConyuge(datosConyuge).subscribe(
          (data: any) => {
            resultado = data;
            // console.log(resultado);
            if (resultado === 'Conyuge actualizado exitosamente!') {
              this.successMessage = 'Conyuge actualizado exitosamente!';
              this.getListaConyuges();
              this.modalService.dismissAll();
            } else {
              // Error
              this.errorMessage = data;
              this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
            }
          });
      }
    } else {
      this.errorMessage = 'Datos de conyuge incorrectos, favor revise';
      this.modalService.open(content, {windowClass: 'custom-width-error-modal'});
      return Object.values(this.FormularioDatosConyuge.controls).forEach(control => {
        if (control instanceof FormGroup) {
          // tslint:disable-next-line:no-shadowed-variable
          Object.values(control.controls). forEach( control => control.markAllAsTouched());
        } else {
          control.markAllAsTouched();
        }
      });
    }
  }
  // RD Conyuges
  public getListaConyuges(): any {
    this.conyugesServices.getListaConyuges(this.mensajeServicio.Cedula)
      .pipe(map(data => data["LISTACY"]))
      .subscribe((data: any) => {
        this.conyuges = data;
        // console.log(data);
      });
  }

  // RD Referencias
  public getListaReferencias(): any {
    this.referenciasServices.getListaReferencias(this.mensajeServicio.Cedula)
      .pipe(map(data => data["LISTAREF"]))
      .subscribe((data: any) => {
        this.referencias = data;
        // console.log(data);
      });
  }

  get tipoDocCYNoValida() {
    return this.FormularioDatosConyuge.get('tipoDocumentacion').invalid && this.FormularioDatosConyuge.get('tipoDocumentacion').touched;
  }
  get cedulaCYNoValida() {
    return this.FormularioDatosConyuge.get('cedula').invalid && this.FormularioDatosConyuge.get('cedula').touched;
  }
  get apellidoCYNoValido() {
    return this.FormularioDatosConyuge.get('apellidoConyuge').invalid && this.FormularioDatosConyuge.get('apellidoConyuge').touched;
  }
  get nombreCYNoValido() {
    return this.FormularioDatosConyuge.get('nombreConyuge').invalid && this.FormularioDatosConyuge.get('nombreConyuge').touched;
  }
  get generoCYNoValido() {
    return this.FormularioDatosConyuge.get('genero').invalid && this.FormularioDatosConyuge.get('genero').touched;
  }
  get nacionalidadCYNoValido() {
    return this.FormularioDatosConyuge.get('nacionalidad').invalid && this.FormularioDatosConyuge.get('nacionalidad').touched;
  }
  get profesionCYNoValido() {
    return this.FormularioDatosConyuge.get('profesion').invalid && this.FormularioDatosConyuge.get('profesion').touched;
  }
  get cedulaREFNoValida() {
    return this.FormularioDatosReferencia.get('cedula').invalid && this.FormularioDatosReferencia.get('cedula').touched;
  }
  get parentescoREFNoValido() {
    return this.FormularioDatosReferencia.get('parentesco').invalid && this.FormularioDatosReferencia.get('parentesco').touched;
  }
  get apellidoREFNoValida() {
    return this.FormularioDatosReferencia.get('apellido').invalid && this.FormularioDatosReferencia.get('apellido').touched;
  }
  get nombreREFNoValida() {
    return this.FormularioDatosReferencia.get('nombre').invalid && this.FormularioDatosReferencia.get('nombre').touched;
  }
  get direccionREFNoValida() {
    return this.FormularioDatosReferencia.get('direccion').invalid && this.FormularioDatosReferencia.get('direccion').touched;
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
    if (this.formaTelefonos.get('TipoTelefono').value === 'FIJO') {
      if (this.formaTelefonos.get('NumeroTelefono').value.toString().length < 9) {
        return this.formaTelefonos.get('NumeroTelefono').invalid && this.formaTelefonos.get('NumeroTelefono').touched;
      }
    } else if (this.formaTelefonos.get('TipoTelefono').value === 'MOVIL') {
      if (this.formaTelefonos.get('NumeroTelefono').value.toString().length < 10) {
        return this.formaTelefonos.get('NumeroTelefono').invalid && this.formaTelefonos.get('NumeroTelefono').touched;
      }
    }
    return this.formaTelefonos.get('NumeroTelefono').invalid && this.formaTelefonos.get('NumeroTelefono').touched;
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

    this.codigoDireccion = direccion['ID_DIR'];
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

  crearFormularioEntregarCarpeta() {
    this.formaEntregarCarpeta = this.fb.group( {
      NumeroAutorizacion: ['', Validators.required],
      PersonaRecibe: ['', Validators.required],
    });
  }

  cargarFormularioTelefonos(telefono: any) {
    this.formaTelefonos.reset({
      TipoRegistroTelefono: telefono.TIPO.toUpperCase(),
      TipoTelefono: telefono['COD_TDIS'],
      NumeroTelefono: telefono.VALOR_DIS,
      ExtensionTelefono: telefono['EXTEN_DIS']
    });
    this.codigoTelefono = telefono['ID_DIS'];
  }

  crearFormularioTelefonos() {
    this.formaTelefonos = this.fb.group({
      TipoRegistroTelefono: ['CLIENTE'],
      TipoTelefono: ['MOVIL'],
      NumeroTelefono: ['', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]*$')]],
      ExtensionTelefono: ['']
    });
  }
  guardarDireccion() {
    // console.log(this.formaDirecciones);
    if (this.formaDirecciones.invalid == true) {
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
      direccion.Usuario = localStorage.getItem('usuario');
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

  entregarCarpetaEnviar(contentA, contentE) {
    if (this.formaEntregarCarpeta.invalid) {
      return Object.values(this.formaEntregarCarpeta.controls).forEach(control => {
        if (control instanceof FormGroup) {
          // tslint:disable-next-line:no-shadowed-variable
          Object.values(control.controls). forEach( control => control.markAllAsTouched());
        } else {
          control.markAllAsTouched();
        }
      });
    } else {
      this.documentosService.entregarCarpeta(this.mensajeServicio.NumeroCredito,
        this.formaEntregarCarpeta.value.NumeroAutorizacion, this.formaEntregarCarpeta.value.PersonaRecibe
        ).subscribe(
        (data: any) => {
          // console.log(data);
          if (data === true ) {
            this.modalService.dismissAll();
            this.router.navigate(['/fabrica/consulta-general']);
            this.advertenceMessage = `Solicitud ${this.mensajeServicio.NumeroCredito} en estado: Entregada`;
            this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
          } else {
            this.errorMessage = 'El código ingresado no es correcto, intente nuevamente';
            this.modalService.open(contentE, {windowClass: 'custom-width-error-modal'});
          }
      });
    }
  }

  guardarTelefono(contentA) {
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
      let extension = ' ';
      if (this.formaTelefonos.value.ExtensionTelefono !== '') {
        extension = this.formaTelefonos.value.ExtensionTelefono;
      }
      this.formaTelefonos.value.NumeroTelefono = this.formaTelefonos.value.NumeroTelefono.toString().trim();
      if (this.formaTelefonos.value.TipoTelefono === 'FIJO' && this.formaTelefonos.value.NumeroTelefono.length !== 9) {
        this.advertenceMessage = 'El número debe tener 9 dígitos';
        this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
      } else if (this.formaTelefonos.value.TipoTelefono === 'MOVIL' && this.formaTelefonos.value.NumeroTelefono.length !== 10) {
        this.advertenceMessage = 'El número debe tener 10 dígitos';
        this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
      } else {
        this.telefonoService.postTelefono(this.formaTelefonos.value.TipoTelefono,
          this.mensajeServicio.Cedula,
          this.formaTelefonos.value.NumeroTelefono.toString(),
          extension, this.codigoTelefono, this.crearTelefono, localStorage.getItem('usuario')).subscribe(
          (data: any) => {
            if (data.error !== null) {
              // console.log(data.error);
              this.advertenceMessage = 'Teléfono duplicado';
              this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
            } else {
              this.modalService.dismissAll();
              this.telefonos = this.getTelefonos();
              this.successMessage = 'Información guardada!';
            }
          }, (errorServicio) => {
            // console.log('Error');
          }
        );
      }
    }
  }
  onDatosComplementariosChange(newValue, ID_CREDITO_COMPLEMENTARIOS: string) {
    if (this.grabarDatosIngresadosGrid) {
    this.datosComplService.getguardarValor(ID_CREDITO_COMPLEMENTARIOS, newValue, localStorage.getItem('usuario'))
        .subscribe( (resultado: any[] ) => {
          if (resultado.toString() === 'Actualizado!') {
            // this.getDatosComplementarios();
            // this.successMessage = resultado.toString();
          }
        });
      }
  }
  nuevoConyuge(content) {
      this.crearFormularioConyuge();
      this.conyugeID_CONeditable = '';
      this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }
  openCustomWidthVariantCancelar(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
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
  solicitarAnalisis(content, contentWarning) {
    this.fabricaService.getSolicitarAnalisis(this.mensajeServicio.NumeroCredito,
                                            localStorage.getItem('usuario')).subscribe(
        data => {
          var resultado: number = data.toString().indexOf('Solicitud en estado: ');
          if (resultado >= 0) {
            // console.log('Si genera el cambio de estado:' + data.toString());
            this.advertenceMessage = data.toString();
            this.modalService.open(contentWarning, {windowClass: 'custom-width-modal'});
            setTimeout (() => {
            }, 3500);
            this.router.navigate(['/fabrica/consulta-general']);
          } else {
            this.errorMessage = data.toString();
            this.modalService.open(content, {windowClass: 'custom-width-modal'});
          }
          });
  }
  getDocumentosCredito(): any {
    this.documentosService.getDocumentosSubidos(this.mensajeServicio.NumeroCredito)
        .pipe(map (data => data["DOCUMENTOS"]))
        .subscribe((data: any) => {
          this.documentosSubidos = data;
          // console.log(this.documentosSubidos);
        });
  }
  fileChange(event, contentE, contentA) {
    this.archivoSeleccionado = <File> event.target.files[0];
    this.Archivos.push(this.archivoSeleccionado);
    this.loading = true;
    if(this.Archivos.length > 0) {
      //console.log(fileList);
      this.documentosService.postFileImagen(this.Archivos, this.mensajeServicio.NumeroCredito,
        localStorage.getItem('usuario'))
        .subscribe(
          (data: any) => {
            if (data.listaResultado.length > 0) {
              this.loading = false;
              this.successMessage = 'Archivo cargado';
            }
            if (data.listaErrores.length > 0) {
              let mensajeError = '';
              for (const mensaje of data.listaErrores) {
                mensajeError += mensaje + '\n';
              }
              this.loading = false;
              this.errorMessage = mensajeError;
              this.modalService.open(contentE, {windowClass: 'custom-width-error-modal'});
            }
            if (data.listaAdvertencias.length > 0) {
              let mensajeAdvertencia = '';
              for (const mensaje of data.listaAdvertencias) {
                mensajeAdvertencia += mensaje + '\n';
              }
              this.loading = false;
              this.advertenceMessage = mensajeAdvertencia;
              this.modalService.open(contentA, {windowClass: 'custom-width-error-modal'});
            }
            this.documentosSubidos = this.getDocumentosCredito();
          }
        );
    }
  }
  cambiarPestania(opcion: string) {
    // console.log('Cambio opcion:'+opcion);
  }
}

