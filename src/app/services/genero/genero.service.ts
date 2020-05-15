import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  constructor(private http: HttpClient) { }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    return this.http.get(url);
  }

  public getGeneros() {
    return this.getQuery(`Genero`);
  }
}
