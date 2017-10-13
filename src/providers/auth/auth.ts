import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  constructor(public http: Http) {
    console.log('Hello AuthProvider Provider');
  }

  funcionariosURL:string = 'http://fastair.ourproject.cl/public/aut';

  getFuncionario(datos) {
    let body = datos;
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post( this.funcionariosURL, body, { headers })
      .map( res => {
        console.log(res.json());
      });
  }

}
