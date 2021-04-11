import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TarjetasTrelloService } from 'src/app/services/tarjetasTrello/tarjetas-trello.service';

@Component({
  selector: 'app-prioridad-uno',
  templateUrl: './prioridad-uno.component.html',
  styleUrls: ['./prioridad-uno.component.css']
})
export class PrioridadUnoComponent implements OnInit {
  @ViewChild('warningID',{ static: false })
  private warningID: TemplateRef<any>;
  closeResult = '';
  public infos: Array<Object> = [];
  public areas: Array<Object> = [
    {nom: "Operaciones", num: 1},
    {nom: "Riesgos", num: 7},
    {nom: "Casas Comerciales", num: 21},
    {nom: "Automotriz", num: 34},
    {nom: "Administración", num: 6},
    {nom: "Procesos", num: 8},
  ];
  public imagesTrello= [
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg",
    "https://trello-attachments.s3.amazonaws.com/60649fa7cc7fe101a35130d0/6070d44d9ef91d8126180481/566d02b9a30bfe4b90a8c9ae79206459/710619.jpg"
  ];
  currentRate = 1;
  tiempoTimer = 90000;
  
  constructor(private modalService: NgbModal, private tarjetaService: TarjetasTrelloService,private router:Router) { }

  ngAfterViewInit(){
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
            console.log(this.warningID)
          this.openWarning(this.warningID);        
          }
        })
      }
    })    
/*     this.areas=[];
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
  ngOnInit() {
    this.tarjetaService.login("Inicio",0)
    
  }
  
  cerrar(){
    this.modalService.dismissAll();
      this.router.navigate(["/inicio"])
  }
  
  openWarning(warning) {
    this.modalService.open(warning, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
  async llamar(xd) {
    this.tarjetaService.tarjetaServicio=[]
    this.tarjetaService.login(xd,0).then(() => {
      this.infos = this.tarjetaService.tarjetaServicio
    }
    )
  }

  openImage(imageContent){
    this.modalService.open(imageContent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    setTimeout(() => {
      this.modalService.dismissAll();
    }, this.tiempoTimer);
    this.modalService.open(content, { backdrop:"static", keyboard:false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult)
      if(this.closeResult!="Cross click"){
        this.modalService.dismissAll();        
      }
      
    });

  }
  arrayRemove(arr, value){     
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}



  saveVoto(valor, item) {    
    this.tarjetaService.votar(valor, item.id, item.usuarios)
    this.tarjetaService.agregarUsuarrioVoto(item.id,item.usuarios,valor)
    this.modalService.dismissAll()
    this.infos=this.arrayRemove(this.infos,item)
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}

