import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';
import { mensaje } from '../../clases/mensaje';

import 'rxjs/add/operator/map';


@Injectable()
export class AuthProvider {

  msg:mensaje[]=[];

  constructor(public http: Http,
              public alert: AlertController,
              public oneSignal: OneSignal) {
  }

  funRegistro:string= '';
  DatosFun:any=[];
  sessionStart:boolean = false;

  funcionariosURL:string = 'http://fastair.ourproject.cl/public/aut';
  sendOneSing:string = 'https://fastair.ourproject.cl/public/credenciales';


  getFuncionario(datos) {
    let body = datos;
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post( this.funcionariosURL, body, { headers })
      .map( res => {
        let dateRes = res.json();
          if(dateRes == '') {
            this.funRegistro = '';
            this.DatosFun = [];
            this.alert.create({
              title:'No se encontraron Datos con este bp',
              buttons:['OK']
            }).present();
          }else{
            this.DatosFun = dateRes;
            for (let re of dateRes) {
              this.funRegistro = re.registro;
            }
            this.updatePlayerID(this.getOneSignal());

          }
        console.log(this.DatosFun);
        console.log(this.funRegistro);
      });
  }

  getOneSignal():any{
    let userID;
    this.oneSignal.startInit('a9ade8e0-a97b-4493-9e90-ed8c03cf3a75', '520421720191');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {
      alert(data.notification);
      let resp = data.notification;
      let momentoActual = new Date();
      let fechaA =momentoActual.getHours()+"-"+momentoActual.getMinutes()+"-"+momentoActual.getSeconds();
      let mensag = new mensaje (fechaA, resp.payload.title, resp.payload.body );

      this.msg.push(mensag);

    });
    this.oneSignal.getIds().then( (datos) =>{
      return userID = datos.userId;
    });

    this.oneSignal.endInit();

  }

  updatePlayerID(idOne){
    let url = this.sendOneSing+"/"+this.funRegistro;
    let body = {
      "playerID":idOne
    };
    let headers = new Headers({
      'Content-Type':'application/json'
    });

    return this.http.put( url, body, { headers })
      .map( res => {
        console.log(res.json());
      });
  }


}
