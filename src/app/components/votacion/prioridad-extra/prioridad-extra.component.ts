import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TarjetasTrelloService } from 'src/app/services/tarjetasTrello/tarjetas-trello.service';




@Component({
  selector: 'app-prioridad-extra',
  templateUrl: './prioridad-extra.component.html',
  styleUrls: ['./prioridad-extra.component.css']
})
export class PrioridadExtraComponent implements OnInit {
  @ViewChild('warningID', { static: false })
  private warningID: TemplateRef<any>;
  closeResult = '';
  public infos= [];
  public infosMostrar= [];
  public areas: Array<Object> = [
  ];
  currentRate = 1;

  constructor(private modalService: NgbModal, private tarjetaService: TarjetasTrelloService, private router: Router) { }


  ngAfterViewInit() {
    try {
      this.tarjetaService.obtenerUsuarioTrello(localStorage.getItem('usuario')).then(async aux => {
        if (aux == "") {
          await this.tarjetaService.usuarioTreello().then(usuario => {
            this.tarjetaService.enviarDatosUsuarioTrello([usuario.username, localStorage.getItem('usuario')])
          })
        } else {
          await this.tarjetaService.usuarioTreello().then(usuario => {
            if (aux == usuario.username) {
              console.log("bin :v")
              
            } else {
              this.openWarning(this.warningID);
            }
          })
        }
      })
    } catch {
      console.log("Mal >:v")
      this.openWarning(this.warningID);

    }
    this.areas=this.tarjetaService.areas
    this.tarjetaService.cargarDatos(1).then(async (aux) => {
       this.infos = await aux
      
    }
    )
    
    
    



    /*   this.areas=[];
        this.tarjetaService.obtenerAreasTrello().then(async datos=>{      
         await datos.Datos.forEach(element => {
           this.areas.push(element.Nombre_Area)
         });
         this.areas.sort(      
         function(a, b){
           console.log(a)
           if(a < b) { return -1; }
           if(a > b) { return 1; }
           return 0;
       }
         )
       }) */

  }
  ordenar(area){
    this.areas.forEach(datos=>{

    })

  }
  ngOnInit() {
    this.tarjetaService.login("Inicio", 0)
  }

  cerrar() {
    this.modalService.dismissAll();
    this.router.navigate(["/inicio"])
  }

  openWarning(warning) {
    this.modalService.open(warning).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalService.dismissAll();
      this.router.navigate(["/inicio"])
    });

  }
  changeClient(event) {
    this.llamar(event.toString())
  }
  async llamar(xd){
    this.infosMostrar=[]
    this.infos.forEach(datos=>{
      if(datos.area==xd){
        this.infosMostrar.push(datos)
      }
    })
  }

  openImage(imageContent) {
    this.modalService.open(imageContent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.currentRate = 1;
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.currentRate = 1;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalService.dismissAll();
    });

  }
  arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }



  saveVoto(valor, item) {
    this.tarjetaService.votar(valor, item.id, item.usuarios)
    this.tarjetaService.agregarUsuarrioVoto(item.id, item.usuarios, valor)
    this.modalService.dismissAll()
    this.currentRate = 1;
    this.infos = this.arrayRemove(this.infos, item)
    this.infosMostrar=[]    
    this.infos.forEach(datos=>{
      if(datos.area==item.area){
        this.infosMostrar.push(datos)
      }
    })
    this.areas.forEach((datos:any)=>{
      if(datos.nom==item.area){
        datos.num-=1
      }
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.currentRate = 1;
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.currentRate = 1;
      return 'by clicking on a backdrop';
    } else {
      this.currentRate = 1;
      return `with: ${reason}`;
    }
  }


}

export class NgbdModal2Content {
  constructor(public activeModal: NgbActiveModal) { }
}