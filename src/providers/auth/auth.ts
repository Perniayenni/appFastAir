import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AlertController, Platform } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';
import { mensaje } from '../../clases/mensaje';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';


@Injectable()
export class AuthProvider {

  msg:mensaje[]=[];
  userID:string= "";

  funRegistro:string= '';
  DatosFun:any=[];
  sessionStart:boolean = false;

  funcionariosURL:string = 'http://fastair.ourproject.cl/public/aut';
  sendOneSing:string = 'https://fastair.ourproject.cl/public/credenciales';


  constructor(public http: Http,
              public alert: AlertController,
              public oneSignal: OneSignal,
              private storage: Storage,
              private platform: Platform) {
    this.cargarMensajesStorage();
  }



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
            this.sessionStart=false;
          }else{
            this.DatosFun = dateRes;
            this.sessionStart= true;
            for (let re of dateRes) {
              this.funRegistro = re.registro;
            }
            console.log(this.sessionStart);
            this.guardamosStorageSession();

          }
      });
  }

    getOneSignal(){

      this.oneSignal.startInit('b4872d1c-8bae-4355-aef6-6bec584fc6af', '1076348014901');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let resp = data.payload;

      ///////// Creamos La fecha Actual ////////
      let FechaActual = new Date();
      let hora =FechaActual.getHours()+":"+FechaActual.getMinutes()+":"+FechaActual.getSeconds();
      let fechaA = FechaActual.getDate()+"-"+FechaActual.getMonth()+"-"+FechaActual.getFullYear();
      let fechaCompleta = fechaA+" "+hora;

      ///////// guardamos en la clase ////////
      let mensag = new mensaje (fechaCompleta, resp.title, resp.body )
      this.msg.push(mensag);

      ///////// Guardamos en LocalStorage ////////
      this.guardarMensajesStorage();
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {
      alert(data.notification.payload.body);
    });

    this.oneSignal.getIds().then( (datos) =>{
       this.updatePlayerID(datos.userId);

    });

    this.oneSignal.endInit();

  }

    updatePlayerID(idOne){
    console.log("Entro en update");
    console.log(idOne);
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

    private guardarMensajesStorage(){
        if (this.platform.is('cordova')){
          this.storage.set('mensajes', this.msg);
        }else{
          // computadora
          localStorage.setItem('mensajes', JSON.stringify(this.msg));
        }
    }

    cargarMensajesStorage(){

      let promesa = new  Promise ( (resolve, reject) => {
        if (this.platform.is('cordova')){
          //Dispositivo
          this.storage.ready()
            .then(()=>{

            this.storage.get('mensajes')
                .then(mesajes =>{
                  if(mesajes){
                    this.msg =mesajes;
                  }
                  resolve();
                })
            });
        }else{
          //Computadora
          if (localStorage.getItem('mensajes')){
            this.msg = JSON.parse(localStorage.getItem('mensajes'))
          }
          resolve();
        }

      });

    }

    private guardamosStorageSession(){
      if (this.platform.is('cordova')){
        this.storage.set('SessionStart', this.sessionStart);
        this.storage.set('funcionarios', this.DatosFun);
      }else{
        // computadora
        localStorage.setItem('SessionStart', JSON.stringify(this.sessionStart));
        localStorage.setItem('funcionarios', JSON.stringify(this.DatosFun));
      }

    }

    public cargarStorageSession(){
      let promesa = new  Promise ( (resolve, reject) => {
        if (this.platform.is('cordova')){
          //Dispositivo
          this.storage.ready()
            .then(()=>{

              this.storage.get('SessionStart')
                .then(res =>{
                  if(res){
                    this.sessionStart = res;

                  }
                  resolve();
                })

              this.storage.get('funcionarios')
                .then(res =>{
                  if(res){
                    this.DatosFun = res;
                  }
                  resolve();
                })
            });
        }else{
          //Computadora
          if (localStorage.getItem('SessionStart')){
            this.sessionStart = JSON.parse(localStorage.getItem('SessionStart'));
            this.DatosFun = JSON.parse(localStorage.getItem('funcionarios'));
          }
          resolve();
        }

      });
    }
}
