import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AlertController, Platform, LoadingController } from 'ionic-angular';
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


  constructor(public http: Http,
              public alert: AlertController,
              public oneSignal: OneSignal,
              private storage: Storage,
              private platform: Platform,
              private loadingController:LoadingController) {
    //this.cargarMensajesStorage();
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
      /*let resp = data.payload;
      console.log("Entro en OnseSignal Notificación.");

      ///////// Creamos La fecha Actual ////////
      let FechaActual = new Date();
      let hora =FechaActual.getHours()+":"+FechaActual.getMinutes()+":"+FechaActual.getSeconds();
      let fechaA = FechaActual.getDate()+"-"+FechaActual.getMonth()+"-"+FechaActual.getFullYear();
      let fechaCompleta = fechaA+" "+hora;

      ///////// guardamos en la clase ////////
      let mensag = new mensaje (fechaCompleta, resp.title, resp.body )
      this.msg.push(mensag);

      ///////// Guardamos en LocalStorage ////////
      this.guardarMensajesStorage();*/
    });

   this.oneSignal.handleNotificationOpened().subscribe(data => {
      alert(data.notification.payload.body);
     let resp = data.notification.payload;
     let FechaActual = new Date();
     let hora =FechaActual.getHours()+":"+FechaActual.getMinutes()+":"+FechaActual.getSeconds();
     let fechaA = FechaActual.getDate()+"-"+FechaActual.getMonth()+"-"+FechaActual.getFullYear();
     let fechaCompleta = fechaA+" "+hora;

     ///////// guardamos en la clase ////////
     let mensag = new mensaje (fechaCompleta, resp.title, resp.body )
     this.msg.push(mensag);
     this.guardarMensajesStorage();
    });
    console.log("Ento en Onesin");
    this.oneSignal.getIds().then( (datos) =>{
       this.updatePlayerID(datos.userId);

    });

    this.oneSignal.endInit();

  }

    updatePlayerID(idOne){
    console.log("Entra en Update");
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
                    console.log("Cargando el storage funcionarios "+JSON.parse(resps));
                    console.log(JSON.stringify(this.DatosFun));
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
