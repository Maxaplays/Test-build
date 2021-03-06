import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isAutenticated: boolean;

  constructor(private http: HttpClient) {
    // console.log('Servicio Inicializado');
  }

  private getQuery(query: string) {
    const url = environment.urlServiciosBackend + query;
    // console.log(url);
    return this.http.get(url);
  }
  public getLogin(user: string, password: string) {
    return this.getQuery(`login?username=${ user }&password=${ password }`);
  }

  public changePassword(user: string, password: string, newPassword: string) {
    return this.getQuery(`PasswordChange?userName=${ user }&password=${ password }&newpassword=${ newPassword }`)
  }

  public resetearContra(email,pathRestore){
    let path = environment.urlServiciosBackend + 'ResetPassword';
    return this.http.post<any>(path, {email,pathRestore}).toPromise()
  }

  public restablecerContra(newpassword: string, token: string){
    let path = environment.urlServiciosBackend + 'RestorePassword';
    return this.http.post<any>(path, {newpassword,token}).toPromise()
  }
}
