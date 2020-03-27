import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {TipoDocumentacionService} from '../../services/tipo-documentacion.service';

@Component({
  selector: 'app-content-fabrica',
  templateUrl: './content-fabrica.component.html',
  styleUrls: ['./content-fabrica.component.css']
})

export class ContentFabricaComponent implements OnInit {
  closeResult: string;
  tiposDoc;

  private _error = new Subject<string>();

  staticAlertClosed = false;
  errorMessage: string;

  constructor(private modalService: NgbModal,private tipoDocumentacionService: TipoDocumentacionService) {
    this.tiposDoc= this.getTipoDoc();
    console.log(this.tiposDoc);
  }
  private getTipoDoc() {
    this.tipoDocumentacionService.getTipoDoc().subscribe(
      (data: any) => {
        // this.tipos = data;
        // console.log(parametro);
        // this.username = data.username;
        console.log(data);
        // this.nombre = data;
      }, (errorServicio) => {
        console.log('Error');
      }
    );
  }

  ngOnInit(): void {
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

}




