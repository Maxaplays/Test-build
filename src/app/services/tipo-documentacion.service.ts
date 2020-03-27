import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentacionService {

  constructor(private http: HttpClient) {
    console.log('TipoDocService');
  }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    console.log('TipoDocService' + url);
    // return null;
    return this.http.get(url);
  }
  public getTipoDoc() {
    return this.getQuery('tipodocumento');
  }
}
