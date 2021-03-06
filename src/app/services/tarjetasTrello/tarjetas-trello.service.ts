import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarjetasTrelloService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  token: string = "";
  key = 'efd482bf9c3079ab48c97f1ac2f2d3f1';
  datosCompletos = []
  boards = [];
  cards = [];
  customs = [];
  tarjetasId = []
  listaMover = []
  areas=[]
  tarjetaServicio: Tarjeta[] = [];
  constructor(public http: HttpClient) {

  }

  async login(dataArea, flag) {
    if (window['Trello']) {
      console.log("Attempting to authorize");
      window['Trello'].authorize({
        type: 'popup',
        name: 'Externo',
        scope: {
          read: 'true',
          write: 'true'
        },
        expiration: '30days',
        key: 'efd482bf9c3079ab48c97f1ac2f2d3f1',
        response_type: 'token',
        success: async () => { await this.success(dataArea, flag) },
        error: () => { this.failure() },
      });
    } else {
      console.log('Trello does not exist.');
    }


  }
  async success(dataArea, flag) {
    this.token = window['Trello'].token();
    if (dataArea != "Inicio") {
      await this.obtenerCustoms().then(
        tarjetas => {
          let bandera = false
          tarjetas.forEach(element => {
            this.customs.forEach(x => {
              if (x[0] == element.id) {
                bandera = true
              }

            });
            if (!bandera) {
              this.customs.push([element.id, element.name])
            }

          });
        }
      )
      console.log(this.customs);
      let listasNoDeseadas = ["Plantilla", "Backlog", "Sprint", "Doing", "Certificado BKM", "Certificado MFC", "Autorizado Paso Producción MFC", "En Producción"]

      await this.obtener().then(
        async aux => {
          let bandera = false
          aux.forEach(element => {
            if (!listasNoDeseadas.includes(element.name)) {
              this.boards.forEach(x => {
                if (x[0] == element.id) {
                  bandera = true
                }
              });
              if (!bandera) {
                this.boards.push([element.id, element.name])
              }
            }
          });

        }
      )
      console.log(this.boards)
      await this.obtenerTarjetas(flag)
    }
  }

  async cargarDatos(flag): Promise<any> {
      await this.obtenerCustoms().then(
        tarjetas => {
          let bandera = false
          tarjetas.forEach(element => {
            this.customs.forEach(x => {
              if (x[0] == element.id) {
                bandera = true
              }

            });
            if (!bandera) {
              this.customs.push([element.id, element.name])
            }

          });
        }
      )
      console.log(this.customs);
      let listasNoDeseadas = ["Plantilla", "Backlog", "Sprint", "Doing", "Certificado BKM", "Certificado MFC", "Autorizado Paso Producción MFC", "En Producción"]
      await this.obtener().then(
        async aux => {
          let bandera = false
          aux.forEach(element => {
            if (!listasNoDeseadas.includes(element.name)) {
              this.boards.forEach(x => {
                if (x[0] == element.id) {
                  bandera = true
                }
              });
              if (!bandera) {
                this.boards.push([element.id, element.name])
                this.areas.push({ nom: element.name, num: 0 },)   
              }
            }
          });

        }
      )
      console.log(this.areas)
      console.log(this.boards)      

      await this.obtenerTarjetas(flag)
      return this.tarjetaServicio
  }


  async obtener(): Promise<any> {
    const path = `https://api.trello.com/1/boards/60649fa7cc7fe101a35130d0/lists?key=${this.key}&token=${this.token}`;
    return this.http.get<any>(path).toPromise()
  }
  failure() {
    console.log("Couldn't authenticate successfully.");
  }

  obtenerCustoms(): Promise<any> {
    let path = `https://api.trello.com/1/boards/60649fa7cc7fe101a35130d0/customFields?key=${this.key}&token=${this.token}`;
    return this.http.get<any>(path).toPromise()
  }
  async llamarTarjetas(dataArea): Promise<any> {
    let aux = ""
    this.cards = [];
    this.boards.forEach((element) => {
      if (element[1] == dataArea) {
        aux = element[0]
      }
    })
    if (aux != "") {
      let path = `https://api.trello.com/1/lists/${aux}/cards?attachments=true&customFieldItems=true&checklists=all&key=${this.key}&token=${this.token}`;
      return this.http.get<any>(path).toPromise()
    } else {
      return null
    }
  }
  
  async obtenerTarjetas(flag) {
    let bandera = false
    this.boards.forEach(async dataArea1 => {
      await this.llamarTarjetas(dataArea1[1]).then(
        async tarjetas => {
          if (tarjetas != null) {
            tarjetas.forEach(async element => {
              await element.labels.forEach(async prioridades => {
                if (flag == 1) {
                  if (prioridades.name != "Prioridad 1") {
                    this.cards.forEach(aux => {
                      if (aux.id == element.id) {
                        bandera = true
                      }
                    });
  
                    if (!bandera) {
                      this.cards.push(await element)
                    }
  
                  }
                } else {
                  if (prioridades.name == "Prioridad 1") {
                    this.cards.forEach(aux => {
                      if (aux.id == element.id) {
                        bandera = true
                      }
                    });
                    if (!bandera) {
                      this.cards.push(await element)
                    }
                  }
                }
  
              });
  
  
            })
          }
        }
      )
      await this.agrupar(dataArea1)    
    });
  }

  async moverTarjetasBacklog(): Promise<any> {
    let idBacklog = ""
    let idHistoriaAprovada = ""
    let listasNoDeseadas = ["Plantilla", "Backlog", "Sprint"]
    await this.obtenerCustoms().then(datos => {
      datos.forEach(element => {
        if (element.name == "Aprobación Historia de Usuario") {
          idHistoriaAprovada = element.id
        }
      });
    })
    await this.obtener().then(
      async aux => {
        let bandera = false
        aux.forEach(element => {
          if (element.name == "Backlog") {
            idBacklog = element.id
          }
          if (!listasNoDeseadas.includes(element.name)) {
            this.boards.forEach(x => {
              if (x[0] == element.id) {
                bandera = true
              }
            });
            if (!bandera) {
              this.boards.push([element.id, element.name])
            }
          }
        });

      }
    )
    for (let i = 0; i < this.boards.length; i++) {
      let bandera = false;
      await this.llamarTarjetas(this.boards[i][1]).then(
        async tarjetas => {
          await tarjetas.forEach(async datosTarjetas => {
            this.tarjetasId.forEach(x => {
              if (x == datosTarjetas.id) {
                bandera = true
              }
            });
            if (!bandera) {
              this.tarjetasId.push(datosTarjetas.id)
            }

          });

        }
      )
    }
    for (let i = 0; i < this.tarjetasId.length; i++) {
      let bandera = false;
      await this.obtenerDatosCustoms(this.tarjetasId[i]).then(
        async tarjetas => {
          await tarjetas.forEach(async datosTarjetas => {
            if (idHistoriaAprovada == datosTarjetas.idCustomField && datosTarjetas.value.checked == "true") {
              this.listaMover.forEach(x => {
                if (x == this.tarjetasId[i]) {
                  bandera = true
                }
              });
              if (!bandera) {
                this.listaMover.push(this.tarjetasId[i])
              }
            }
          });
        }
      )
    }
    for (let i = 0; i < this.listaMover.length; i++) {
      const path2 = `https://api.trello.com/1/cards/${this.listaMover[i]}?idList=${idBacklog}&key=${this.key}&token=${this.token}`;
      await this.mandarTrajeta(path2).then(element => {
        console.log(element)
      })

    }

  }
  limpiar() {
    this.tarjetasId = []
    this.listaMover = []
    this.boards = []

  }
  async regresarTarjetas(): Promise<any> {
    let area = ""
    let idVotado = ""
    let listasNoDeseadas = ["Plantilla", "Sprint"]
    await this.obtenerCustoms().then(datos => {
      datos.forEach(element => {
        if (element.name == "Votado") {
          idVotado = element.id
        }
        if (element.name == "Area") {
          area = element.id
        }
      });
    })
    await this.obtener().then(
      async aux => {
        let bandera = false
        aux.forEach(element => {
          if (!listasNoDeseadas.includes(element.name)) {
            this.boards.forEach(x => {
              if (x[0] == element.id) {
                bandera = true
              }
            });
            if (!bandera) {
              this.boards.push([element.id, element.name])
            }
          }
        });
      }
    )

    for (let i = 0; i < this.boards.length; i++) {
      let bandera = false;
      if (this.boards[i][1] == "Backlog") {
        await this.llamarTarjetas(this.boards[i][1]).then(
          async tarjetas => {
            await tarjetas.forEach(async datosTarjetas => {
              this.tarjetasId.forEach(x => {
                if (x == datosTarjetas.id) {
                  bandera = true
                }
              });
              if (!bandera) {
                this.tarjetasId.push(datosTarjetas.id)
              }

            });

          }
        )
      }
    }
    for (let i = 0; i < this.tarjetasId.length; i++) {
      let bandera = false;
      await this.cambiarEstadoVotado(this.tarjetasId[i], idVotado).then(element => {
        console.log(element)
      }
      )
      await this.obtenerDatosCustoms(this.tarjetasId[i]).then(
        async tarjetas => {
          await tarjetas.forEach(async datosTarjetas => {
            if (area == datosTarjetas.idCustomField) {
              await this.obtenerOpcion(area, datosTarjetas.idValue).then(
                datos => {
                  this.listaMover.forEach(x => {
                    if (x == this.tarjetasId[i]) {
                      bandera = true
                    }
                  });
                  if (!bandera) {
                    this.listaMover.push([this.tarjetasId[i], datos.value.text])
                  }
                })
              }
            });
          }
      )
    }
    for (let i = 0; i < this.listaMover.length; i++) {
      let aux = ""
      this.boards.forEach(areas => {
        if (this.listaMover[i][1] == areas[1]) {
          aux = areas[0]
        }
      })
      if (aux != "") {
        const path2 = `https://api.trello.com/1/cards/${this.listaMover[i][0]}?idList=${aux}&key=${this.key}&token=${this.token}`;
        await this.mandarTrajeta(path2).then(element => {
          console.log(element)
        })
      }


    }

  }
  async cambiarEstadoVotado(id, aux): Promise<any> {
    const payload = {
      "value": { "checked": "true" }
    }
    let path2 = `https://api.trello.com/1/cards/${id}/customField/${aux}/item?key=${this.key}&token=${this.token}`;
    return this.http.put<any>(path2, payload).toPromise()
  }
  async mandarTrajeta(path2): Promise<any> {
    return this.http.put<any>(path2, {}).toPromise()

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
  async usuarioTreello() {
    let path = `https://api.trello.com/1/members/me?key=${this.key}&token=${this.token}`;
    return this.http.get<any>(path).toPromise()
  }
  async agrupar(nombreArea): Promise<any> {
    this.cards.forEach(async Datos => {
      let aux: Tarjeta = new Tarjeta();
      let idArea;
          aux.area = nombreArea[1]
          idArea = nombreArea[0]
      if (Datos.idList == idArea) {        
        aux.id = Datos.id
        aux.descripcion = Datos.desc
        aux.nombre = Datos.name
        aux.prioridad = Datos.labels[0].name
        if (Datos.idMembers[0] != null) {
          await this.obtenerPropietario(Datos.idMembers[0]).then(
            (dato) => {
              aux.propietario = dato.fullName
            }
          )
        } else {
          aux.propietario = ""
        }
        if (Datos.idChecklists[0] != null) {
          await this.obtenerCriterios(Datos.idChecklists[0]).then(
            datos => {
              let dato = []
              datos.checkItems.forEach(element => {
                dato.push(element.name)
              });
              aux.criterios = dato
            }
          )

        } else {
          aux.criterios = []
        }
        aux.imgs = Datos.attachments;
        Datos.customFieldItems.forEach(datosCustoms => {
          this.customs.forEach(async (otrosDatos) => {
            if (otrosDatos[1] == "Fecha Ingreso" && otrosDatos[0] == datosCustoms.idCustomField) {
              aux.fechaIngreso = new Date(datosCustoms.value.date);
            }
            if (otrosDatos[1] == "Valor Agregado al Cliente" && otrosDatos[0] == datosCustoms.idCustomField) {
              if ((datosCustoms.value.checked == "true")) {
                aux.valorCliente = "Si";
              } else {
                aux.valorCliente = "";
              }

            }
            if (otrosDatos[1] == "Valor Agregado al Negocio" && otrosDatos[0] == datosCustoms.idCustomField) {
              if (datosCustoms.value.checked == "true") {
                aux.valorNegocio = "Si"
              } else {
                aux.valorNegocio = "";
              }
            }
            if (otrosDatos[1] == "Aprobación Historia de Usuario" && otrosDatos[0] == datosCustoms.idCustomField) {
              aux.historia = (datosCustoms.value.checked == "true");
            }
            if (otrosDatos[1] == "Votado" && otrosDatos[0] == datosCustoms.idCustomField) {
              aux.votado = (datosCustoms.value.checked == "true");
            }
            if (otrosDatos[1] == "Tipo de Beneficio" && otrosDatos[0] == datosCustoms.idCustomField) {
              await this.obtenerOpcion(datosCustoms.idCustomField, datosCustoms.idValue).then(
                datos => {
                  aux.tipo = datos.value.text;
                }
              )
            }
            if (otrosDatos[1] == "Cuantificación" && otrosDatos[0] == datosCustoms.idCustomField) {
              aux.cuantificacion = (datosCustoms.value.number).toString();
            }
            if (otrosDatos[1] == "Razón" && otrosDatos[0] == datosCustoms.idCustomField) {
              aux.razon = datosCustoms.value.text;
            }
            if (otrosDatos[1] == "Observaciones" && otrosDatos[0] == datosCustoms.idCustomField) {
              aux.observaciones = datosCustoms.value.text;
            }
            if (otrosDatos[1] == "Usuarios" && otrosDatos[0] == datosCustoms.idCustomField) {
              aux.usuarios = datosCustoms.value.text;
            }
            if (otrosDatos[1] == "Peso Total" && otrosDatos[0] == datosCustoms.idCustomField) {
              try {
                aux.peso = Number(datosCustoms.value.number);
              } catch {
                aux.peso = 0
              }
            }
          })
        });
      }
      let bandera = false
      this.tarjetaServicio.forEach(element => {
        if (element.nombre == (aux.nombre)) {
          bandera = true
        }
      });
      if (aux.usuarios != null) {
        await this.usuarioTreello().then(usuario => {
          if (aux.usuarios.includes(usuario.fullName)) {
            bandera = true
          }
        })
      }
      if (!bandera && aux.id != null && aux.historia && !aux.votado) {
        this.tarjetaServicio.push(aux)
        this.areas.forEach(datos=>{
          if(datos.nom==aux.area){
            datos.num+=1;
          }

        })
      }
    })
    console.log(this.tarjetaServicio)
  }
  async agregarUsuarrioVoto(id, usuarios, valor) {
    let dato;
    if (usuarios != null) {
      await this.usuarioTreello().then(usuario => {
        dato = usuarios.toString() + "," + valor + "_" + usuario.fullName
      })

    } else {
      await this.usuarioTreello().then(usuario => {
        dato = valor + "_" + usuario.fullName
      })
    }
    const payload = {
      "value": { "text": dato }
    }
    let aux = ""
    this.customs.forEach(element => {
      if (element[1] == "Usuarios") {
        aux = element[0]
      }

    });
    let path2 = `https://api.trello.com/1/cards/${id}/customField/${aux}/item?key=${this.key}&token=${this.token}`;
    this.http.put<any>(path2, payload).toPromise().then(dataArea => {
      console.log(dataArea)
    })

  }
  votar(valor, id, usuarios) {
    let votos = []
    let dato = 0
    if (usuarios != null) {
      votos = usuarios.split(",")
      votos.forEach(element => {
        dato += Number(element.substr(0, element.indexOf("_")))
      });
      dato += valor
      dato = dato / (votos.length + 1)
      dato = Number(dato.toFixed(2))
    } else {
      dato = valor
    }
    const payload = {
      "value": { "number": dato.toString() }
    }
    let aux = ""
    this.customs.forEach(element => {
      if (element[1] == "Peso Total") {
        aux = element[0]
      }

    });
    let path2 = `https://api.trello.com/1/cards/${id}/customField/${aux}/item?key=${this.key}&token=${this.token}`;
    this.http.put<any>(path2, payload).toPromise().then(dataArea => {

      console.log(dataArea)
    })
  }

  enviarDatosSprint(aux) {
    let path = environment.urlServiciosBackend + "votacion/prioridad-config";
    this.http.post<any>(path, aux).toPromise().then(dataArea => {
      console.log(dataArea)
    })
  }
  getDatosSprint() {
    let path = environment.urlServiciosBackend + "votacion/prioridad-config";
    console.log(path)
    return this.http.get<any>(path).toPromise()
  }
  obtenerUsuarioTrello(usuarioMFC) {
    let path = environment.urlServiciosBackend + `votacion/prioridad-extra/${usuarioMFC}`;
    return this.http.get<any>(path).toPromise()
  }

  obtenerAreasTrello() {
    let path = environment.urlServiciosBackend + `votacion/prioridad-extra/areas`;
    return this.http.get<any>(path).toPromise()
  }

  enviarDatosUsuarioTrello(usuarios) {
    let path = environment.urlServiciosBackend + "votacion/prioridad-extra";
    this.http.post<any>(path, usuarios).toPromise().then(dataArea => {
      console.log(dataArea)
    })
  }
}
export class Tarjeta {
  id: string;
  propietario: string;
  area: string;
  fechaIngreso: Date;
  nombre: string;
  descripcion: string;
  prioridad: string;
  valorCliente: string;
  valorNegocio: string;
  cuantificacion: string;
  tipo: string;
  razon: string;
  criterios: any[];
  observaciones: string;
  peso: number;
  historia: boolean;
  votado: boolean;
  usuarios: string;
  imgs: []
}