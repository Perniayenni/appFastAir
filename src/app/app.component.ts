import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth'

import { HomePage } from '../pages/home/home';
import { PagPrincipalPage} from '../pages/pag-principal/pag-principal';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any=HomePage ;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private auth:AuthProvider) {
    platform.ready().then(() => {

      //this.rootPage = HomePage;

    /*  this.auth.cargarStorageSession()
        .then (()=>{
          this.auth.cargarStorageFuncionarios();
                this.auth.cargarMensajesStorage();

                console.log("Despues de cargar el storage");
                console.log(auth.sessionStart);
                console.log(auth.DatosFun);

                if(this.auth.sessionStart){
                  console.log("SessionStart True");
                  this.auth.getOneSignal();
                  this.rootPage = PagPrincipalPage;

                }else{
                  this.rootPage = HomePage;
                }


      });*/

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

