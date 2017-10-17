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
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private auth:AuthProvider) {
    platform.ready().then(() => {

      this.auth.cargarStorageSession();
      console.log(this.auth.sessionStart);

      if(this.auth.sessionStart){
        this.rootPage = PagPrincipalPage;
      }else{
        this.rootPage = HomePage;
      }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

