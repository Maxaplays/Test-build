import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentacionService {

  constructor(private http: HttpClient) {
    // console.log('TipoDocService');
  }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    // console.log('TipoDoc' + url);
    // return null;
    return this.http.get(url);
  }
  public getTipoDoc() {
    return this.getQuery('tipodoc');
  }
}