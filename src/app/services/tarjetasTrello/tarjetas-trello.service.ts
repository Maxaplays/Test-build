import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TarjetasTrelloService {

  token: string = "de5c449e1b01e19cb395ad0d3da7a8bcee24028c18790ae7e0311a4b6ca11dbb";
  key = 'efd482bf9c3079ab48c97f1ac2f2d3f1';
  datosCompletos = []
  boards = [];
  cards = [];
  customs = [];
  tarjetaServicio: Tarjeta[] = [];
  constructor(public http: HttpClient) {

  }

  login() {
    if (window['Trello']) {
      console.log("Attempting to authorize");
      window['Trello'].authorize({
        type: 'popup',
        name: 'Getting Started Application',
        scope: {
          read: 'true',
          write: 'true'
        },
        expiration: 'never',
        success: () => { this.success() },
        error: () => { this.failure() },
      });
    } else {
      console.log('Trello does not exist.');
    }


  }
  success() {
    this.obtenerCustoms();
    let listasNoDeseadas = ["Plantilla", "Backlog", "Sprint"]
    const path = `https://api.trello.com/1/boards/60649fa7cc7fe101a35130d0/lists?key=${this.key}&token=${this.token}`;
    this.http.get<any>(path).pipe().toPromise().then(
      async aux => {
        aux.forEach(element => {
          if (!listasNoDeseadas.includes(element.name)) {
            this.boards.push([element.id, element.name])
          }
        });
        console.log(this.boards)
        await this.obtenerTarjetas()
      }
    )

  }
  failure() {
    console.log("Couldn't authenticate successfully.");
  }

  obtenerCustoms() {
    let path = `https://api.trello.com/1/boards/60649fa7cc7fe101a35130d0/customFields?key=${this.key}&token=${this.token}`;
    this.http.get<any>(path).pipe().toPromise().then(
      tarjetas => {
        tarjetas.forEach(element => {
          this.customs.push([element.id, element.name])
        });
      }
    )
    console.log(this.customs)
  }
  async obtenerTarjetas() {
    let path = `https://api.trello.com/1/lists/6064a111fb30ba0b0e84b57e/cards?key=${this.key}&token=${this.token}`;
    this.http.get<any>(path).toPromise().then(
      async tarjetas => {
        tarjetas.forEach(element => {
          element.labels.forEach(prioridades => {
            if (prioridades.name != "Prioridad 1") {
              this.cards.push(element)
            }
          });


        });
        await this.agrupar("Area2")


      }
    )
    console.log(this.cards)
  }

  obtenerDatosTarjetas() {
    let aux = []
    this.cards.forEach(tarjetas => {
      let path = `https://api.trello.com/1/cards/${tarjetas.id}/?key=${this.key}&token=${this.token}`;
      this.http.get<any>(path).pipe().toPromise().then(
        datos => {
          aux.push(datos)
        }
      )
    })

  }
  async obtenerPropietario(idPropietario): Promise<any> {
    let path = `https://api.trello.com/1/members/${idPropietario}?key=${this.key}&token=${this.token}`;
    return this.http.get<any>(path).toPromise();
  }
  async obtenerCriterios(idCriterio): Promise<any> {
    let aux = []
    let path = `https://api.trello.com/1/checklists/${idCriterio}?key=${this.key}&token=${this.token}`;
    return this.http.get<any>(path).toPromise()
  }
  async obtenerDatosCustoms(idCard): Promise<any> {
    let path = `https://api.trello.com/1/cards/${idCard}/customFieldItems?key=${this.key}&token=${this.token}`;
    return this.http.get<any>(path).toPromise()    
  }
  async obtenerOpcion(idCustom, idValue): Promise<any> {
    let path = `https://api.trello.com/1/customFields/${idCustom}/options/${idValue}?key=${this.key}&token=${this.token}`;
    return this.http.get<any>(path).toPromise()

  }
  async agrupar(nombreArea): Promise<any> {    
    this.cards.forEach(async Datos => {
      let aux: Tarjeta = new Tarjeta();
    let idArea;
    this.boards.forEach(areas => {
      if (areas[1] === nombreArea) {
        aux.area = areas[1]
        idArea = areas[0]
      }
    })
      if (Datos.idList == idArea) {
        aux.descripcion = Datos.desc
        aux.nombre = Datos.name
        aux.prioridad = Datos.labels[0].name
        await this.obtenerPropietario(Datos.idMembers[0]).then(
          (dato) => {
            aux.propietario = dato.fullName
          }

        )
        await this.obtenerCriterios(Datos.idChecklists[0]).then(
          datos => {
            let dato = []
            datos.checkItems.forEach(element => {
              dato.push(element.name)
            });
            aux.criterios = dato
          }
        )
        await this.obtenerDatosCustoms(Datos.id).then(
          
          async datos => {            
            console.log(datos.length)
            for(let a=0;a<datos.length;a++){
              this.customs.forEach(async (otrosDatos) =>{
                if (otrosDatos[1] == "Fecha Ingreso") {
                  if (otrosDatos[0] == datos[a].idCustomField) {
                    console.log(new Date(datos[a].value.date))
                    aux.fechaIngreso = new Date(datos[a].value.date);                  
                  }
                }
                if (otrosDatos[1] == "Valor Agregado al Cliente") {
                  if (otrosDatos[0] == datos[a].idCustomField) {
                    aux.valorCliente = (datos[a].value.checked == "true");
                  }
                }
                if (otrosDatos[1] == "Valor Agregado al Negocio") {
                  if (otrosDatos[0] == datos[a].idCustomField) {
                    aux.valorNegocio = (datos[a].value.checked == "true");
                  }
                }
                if (otrosDatos[1] == "Tipo de Beneficio") {
                  if (otrosDatos[0] == datos[a].idCustomField) {
                    await this.obtenerOpcion(datos[a].idCustomField, datos[a].idValue).then(
                      datos => {                        
                        aux.tipo = datos.value.text;
                        
                      }
                    );
                  }
                }
                if (otrosDatos[1] == "Cuantificación") {
                  if (otrosDatos[0] == datos[a].idCustomField) {
                    console.log(datos[a].value.number)
                    aux.cuantificacion = (datos[a].value.number).toString();
                  }
                }
                if (otrosDatos[1] == "Razón") {
                  if (otrosDatos[0] == datos[a].idCustomField) {
                    console.log(datos[a].value.text)
                    aux.razon = datos[a].value.text.toString();
                  }
                }
                if (otrosDatos[1] == "Observaciones") {
                  if (otrosDatos[0] ==datos[a].idCustomField) {
                    console.log(datos[a].value.text)
                    aux.observaciones = await datos[a].value.text.toString();
                  }
                } 
              })
                    
            }              
            }
            )
        
      }
      let bandera = false
      this.tarjetaServicio.forEach(element => {
        if(element.nombre == (aux.nombre)){
          bandera=true          
        }        
      });
      if(!bandera){
        this.tarjetaServicio.push(aux)
      }                     
      console.log(this.tarjetaServicio)
    })
  }
}
export class Tarjeta {
  propietario: string;
  area: string;
  fechaIngreso: Date;
  nombre: string;
  descripcion: string;
  prioridad: string;
  valorCliente: boolean;
  valorNegocio: boolean;        
  cuantificacion: string;
  tipo:string;
  razon: string;
  criterios: any[];
  observaciones: string;
}