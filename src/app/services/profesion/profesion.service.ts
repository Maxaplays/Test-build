import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfesionService {

  constructor(private http: HttpClient) { }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    return this.http.get(url);
  }

  public getProfesiones() {
    return this.getQuery(`Profesion`);
  }
}
