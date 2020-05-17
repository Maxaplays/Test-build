import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosComplementariosService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };
  constructor(private http: HttpClient ) { 

  }
  private getQuery(query: string) {
    const url = environment.urlServiciosBackend +  query;
    return this.http.get(url);
  }
  public getDatosComplementarios(credito: string) {
    const urlConyuges = 'DatosComlemetarios/getDatos?credito=' + credito;
    return this.getQuery(urlConyuges);
  }
  public getguardarValor(idReg: string, valor: string, usuario: string) {
    const urlConyuges = `DatosComlemetarios/guardarValor?idReg=${idReg}&valor=${valor}&usuario=${usuario}`;
    return this.getQuery(urlConyuges);
  }
  public getguardarComentario(idReg: string, comentario: string, usuario: string) {
    const urlConyuges = `DatosComlemetarios/guardarComentario?idReg=${idReg}&comentario=${comentario}&usuario=${usuario}`;
    return this.getQuery(urlConyuges);
  }
}
export class CREDITO_DATOS_COMPLEMENTARIOS 
{
        NOMBRE_COMPL_PROD: string;
        VALOR_CREDITO_COMPLEMENTARIOS: string;
        COMENTARIO_CREDITO_COMPLEMENTARIOS: string;
        ID_CREDITO_COMPLEMENTARIOS: string;
        catalogos: DATOS_COMPLEMENTARIOS_CATALOGO[];
}
export class DATOS_COMPLEMENTARIOS_CATALOGO 
{
        id: string;
        valor: string;
}
