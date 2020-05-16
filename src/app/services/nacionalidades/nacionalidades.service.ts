import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NacionalidadesService {

  constructor(private http: HttpClient) { }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    return this.http.get(url);
  }

  public getNacionalidades() {
    return this.getQuery(`Nacionalidad`);
  }
}
