import { Component } from '@angular/core';
import { Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth'

import { HomePage } from '../pages/home/home';
import { AntesDePrincipalPage } from '../pages/antes-de-principal/antes-de-principal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private auth:AuthProvider,
              public alert: AlertController,
              private loadingController:LoadingController) {
    platform.ready().then(() => {

      //this.rootPage = HomePage;
     this.auth.cargarStorageSession()
        .then (()=>{

          this.auth.cargarStorageFuncionarios().then(()=>{
            for (let re of auth.DatosFun) {
              this.auth.funRegistro= re.registro;
            }
            if(this.auth.sessionStart){
              this.rootPage = AntesDePrincipalPage;
             // console.log('Cargamos Funcionarios');
             // console.log(this.auth.funRegistro);
             // this.auth.getOneSignal();

            }else{
              this.rootPage = HomePage;
            }
          });


          statusBar.styleDefault();
          splashScreen.hide();
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

    });
  }
}

