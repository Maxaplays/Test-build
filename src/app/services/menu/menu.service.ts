import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    //console.log(url);
    return this.http.get(url);
  }
  public getSucursales(user: string) {
    return this.getQuery(`sucursales?usuario=${ user }`);
  }
}
