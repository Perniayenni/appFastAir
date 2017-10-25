import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { PagPrincipalPage} from '../pag-principal/pag-principal';


@Component({
  selector: 'page-antes-de-principal',
  templateUrl: 'antes-de-principal.html',
})
export class AntesDePrincipalPage {

  PaginaPrincipal:any = PagPrincipalPage;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private auth:AuthProvider, public loadingCtrl: LoadingController) {

  }
  GetMensaje(){
    const loading = this.loadingCtrl.create({
    });
    loading.present();

    this.auth.getMensajes()
       .subscribe(data=>{
            loading.dismiss();
            this.navCtrl.push(this.PaginaPrincipal);
       });
  }


}
