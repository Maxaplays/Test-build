import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isAutenticated: boolean;

  constructor(private http: HttpClient) {
    console.log('Servicio Inicializado');
  }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    console.log(url);
    return this.http.get(url);
  }
  public getLogin(user: string, password: string) {
    return this.getQuery(`login?username=${ user }&password=${ password }`);
  }
}
