import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { TipoDocumentacionService } from 'src/app/services/tipo-documentacion.service';
import { map } from 'rxjs/operators';
import { FormGroup, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import { FabricaService, EnvioFabricaServiceBi } from '../../services/fabricaCredito/fabrica.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-fabrica',
  templateUrl: './content-fabrica.component.html',
  styleUrls: ['./content-fabrica.component.css']
})

export class ContentFabricaComponent implements OnInit {
  closeResult: string;
  private _error = new Subject<string>();

  staticAlertClosed = false;
  errorMessage: string;
  //bkm
  FormularioDatosBasicos: FormGroup;
  tipoDoc:any[] = [];
  datosGenerales: any;
  //bkm

  constructor(private modalService: NgbModal, 
              private tipoDocumentacionService: TipoDocumentacionService, 
              private fabricaService: FabricaService,
              private router:Router) {
    this.tipoDoc = this.getTipoDoc(); // CARGA DEL COMBO DE TIPO DE documentos
    console.log(this.tipoDoc);
  }
  

  ngOnInit(): void {
    this.initForm();
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._error.subscribe((message) => this.errorMessage = message);
    this._error.pipe(
      debounceTime(5000)
    ).subscribe(() => this.errorMessage = null);
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

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  openCustomWidthVariant(content) {
    this.modalService.open(content, {windowClass: 'custom-width-variant-modal'});
  }
  //bkm metodos
  private getTipoDoc():any {
    this.tipoDocumentacionService.getTipoDoc().pipe(map( (data:any) => data["TIPODOC"] ))
        .subscribe( (resultado: any[] ) => {
          this.tipoDoc = resultado;
          console.log(this.tipoDoc);
        });
  }
  private initForm() {
    this.FormularioDatosBasicos = new FormGroup({
      tipoDocumentacion: new FormControl(null, Validators.required),
      cedula: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      estadoCivil: new FormControl(null),
      fechaNacimiento: new FormControl(null)
    });
  }
  ValidarFormularioDatosBasicos(){
    console.log(this.FormularioDatosBasicos.status);
    let envioDatos: EnvioFabricaServiceBi= new EnvioFabricaServiceBi();
    envioDatos.cedula = this.FormularioDatosBasicos.controls['cedula'].value;
    envioDatos.estadoCivil = this.FormularioDatosBasicos.controls['estadoCivil'].value;
    envioDatos.fechaNacimiento = this.FormularioDatosBasicos.controls['fechaNacimiento'].value;
    console.log(envioDatos);
    this.fabricaService.getEnvioFabricaServiceBi(envioDatos).subscribe(
      (data: any) => {
        this.datosGenerales = data;
        console.log('Padre:');
        console.log(this.datosGenerales);
        // this.router.navigate(['/fabrica/nueva-solicitud/credito'], this.datosGenerales);
      }, ( errorServicio ) => {
        //console.log('Error');
      }
    );
    
  }
  //bkm metodos
}

  






