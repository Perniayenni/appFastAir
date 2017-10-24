import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import {AlertController, Platform, LoadingController, NavController} from 'ionic-angular';
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
  sendOneSing:string = 'http://fastair.ourproject.cl/public/credenciales';

  bandera:string = 'D'; // Se coloca Bandera en Default


  constructor(public http: Http,
              public alert: AlertController,
              public oneSignal: OneSignal,
              private storage: Storage,
              private platform: Platform,
              private loadingController:LoadingController) {
  }



  getFuncionario(datos) {
    let loading = this.loadingController.create({
      content: 'Espere por favor'
    });
    loading.present();

    let body = datos;
    let headers = new Headers({
      'Content-Type':'application/json'
    });

    return this.http.post( this.funcionariosURL, body, { headers })
      .map( res => {
        let dateRes = res.json();
        if (dateRes == '') {
          loading.dismiss();
          this.funRegistro = '';
          this.DatosFun = [];
          this.alert.create({
            title: 'No se encontraron Datos con este bp',
            buttons: ['OK']
          }).present();
          this.sessionStart = false;
        } else{
          for (let re of dateRes) {
          if (datos.rut != re.rut) {
            loading.dismiss();
            this.alert.create({
              title: 'Rut no concuerda con bp',
              buttons: ['OK']
            }).present();
            this.sessionStart = false;

          } else {
            loading.dismiss();
            this.DatosFun = dateRes;
            this.sessionStart = true;
            this.funRegistro = re.registro;
            this.getOneSignal();
            console.log("En el getfun sessionstart: " + this.sessionStart);
            console.log(JSON.stringify(this.DatosFun));
            this.guardamosStorageSession();

          }
        }
        }
      });
  }

    getOneSignal(){
    console.log("Entro en OnseSignal");
      this.oneSignal.startInit('b4872d1c-8bae-4355-aef6-6bec584fc6af', '1076348014901');

     //this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      console.log("Entro en OnseSignal Notificación Recibida.");
      console.log("Bandera esta en: "+this.bandera);
        if (this.bandera =='D'){
          console.log("Entra en D Recibido");
          let resp = data.payload;

          ///////// Creamos La fecha Actual ////////
          let FechaActual = new Date();
          let hora =FechaActual.getHours()+":"+FechaActual.getMinutes()+":"+FechaActual.getSeconds();
          let fechaA = FechaActual.getDate()+"-"+FechaActual.getMonth()+"-"+FechaActual.getFullYear();
          let fechaCompleta = fechaA+" "+hora;

          ///////// guardamos en la clase ////////
          console.log("Msg de RECIB Antes "+JSON.stringify( this.msg));
          let mensag = new mensaje (fechaCompleta, resp.title, resp.body );
          this.msg.push(mensag);

          console.log("Msg de RECIB Antes "+JSON.stringify( this.msg));

          ///////// Guardamos en LocalStorage ////////
          this.guardarMensajesStorage();
          this.bandera = 'R';
          console.log("Bandera esta en: "+this.bandera);
        }

    });

   this.oneSignal.handleNotificationOpened().subscribe(data => {
     //alert(data.notification.payload.body);
     console.log("Entro en OnseSignal Notificación Open.");
     console.log("Bandera esta en: " + this.bandera)

     if (this.bandera == 'D') {
       console.log("Entra en D Open");
       let alert = this.alert.create({
         title: data.notification.payload.title,
         subTitle: data.notification.payload.body,
         buttons: ['OK']
       });
       alert.present();

       let resp = data.notification.payload;

       ///////// Creamos La fecha Actual ////////
       let FechaActual = new Date();
       let hora =FechaActual.getHours()+":"+FechaActual.getMinutes()+":"+FechaActual.getSeconds();
       let fechaA = FechaActual.getDate()+"-"+FechaActual.getMonth()+"-"+FechaActual.getFullYear();
       let fechaCompleta = fechaA+" "+hora;

       ///////// guardamos en la clase ////////
       let mensag = new mensaje (fechaCompleta, resp.title, resp.body );
       console.log("Msg de OPEN Antes "+JSON.stringify( this.msg));
       this.msg.push(mensag);
       console.log("Msg de OPEN despues "+JSON.stringify( this.msg));

       ///////// Guardamos en LocalStorage ////////
       this.guardarMensajesStorage();
       this.bandera = 'D';
       console.log("Bandera esta en: "+this.bandera);
     }else{
       this.bandera='D';
       console.log("Bandera desde Elf Open esta en : "+this.bandera);
     }
   });

   this.oneSignal.getIds().then( (datos) =>{
     console.log("Obtenemos Id"+datos.userId);
        this.updatePlayerID(datos.userId);

    });
    this.oneSignal.endInit();

  }

    updatePlayerID(idOne){
      console.log("Entra en Update "+idOne);
    let url = `${this.sendOneSing}/${this.funRegistro}`;
    let idO =  idOne.replace('"','');
      var body = {
        playerID: idO
      };

      let headers = new Headers({
        'Content-Type':'application/json'
      });

      return this.http.put(url, body, {headers})
        .map(res=>{
          console.log("estoy en el post");
          return res.json();
        }).subscribe ( resp => {
          console.log(JSON.stringify(resp));
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

      return new  Promise ( (resolve, reject) => {
        if (this.platform.is('cordova')){
          //Dispositivo
         return this.storage.ready()
            .then(()=>{

            this.storage.get('mensajes')
                .then(mesajes =>{
                  if(mesajes){
                    this.msg =mesajes;
                  }
                  console.log("Mensaje cargado"+ JSON.stringify(this.msg));
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

    EliminarMensajesStorage(){
      this.msg= [];
      this.guardarMensajesStorage();
    }

   private guardamosStorageSession(){
      if (this.platform.is('cordova')){
        this.storage.set('SessionStart', JSON.stringify(this.sessionStart));
        this.storage.set('funcionarios', this.DatosFun);

        this.storage.get('SessionStart').then((val) => {
          console.log('Aqui el Valor', val);
        });

        this.storage.get('funcionarios').then((val) => {
          console.log('Aqui el Valor de funcionarios', JSON.stringify(val));
        });
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
                    console.log("Cargando el storage SessionStart "+JSON.parse(res));
                  }
                  resolve();
                })
            });
        }else{
          //Computadora
          if (localStorage.getItem('SessionStart')){
            this.sessionStart = JSON.parse(localStorage.getItem('SessionStart'));
          }
          resolve();
        }

      });
      return promesa;
    }

    public cargarStorageFuncionarios(){
      let promesa = new  Promise ( (resolve, reject) => {
        if (this.platform.is('cordova')){
          //Dispositivo
          this.storage.ready()
            .then(()=>{

              this.storage.get('funcionarios')
                .then(resps =>{
                  if(resps){
                    this.DatosFun = resps;
                    resolve();
                  }

                })
            });
        }else{
          //Computadora
          if (localStorage.getItem('funcionarios')){
            this.DatosFun = JSON.parse(localStorage.getItem('funcionarios'));
          }
          resolve();
        }

      });
    }
}
