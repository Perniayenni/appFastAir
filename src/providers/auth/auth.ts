import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  constructor(public http: Http,
              public alert: AlertController) {
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
        let dateRes = res.json();
          if(dateRes == '') {
            this.alert.create({
              title:'No se encontraron Datos con este bp',
              buttons:['OK']
            }).present();
          }else{

          }
        console.log(res.json());
      });
  }

}
