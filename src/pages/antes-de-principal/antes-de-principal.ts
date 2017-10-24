import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { PagPrincipalPage} from '../pag-principal/pag-principal';


@Component({
  selector: 'page-antes-de-principal',
  templateUrl: 'antes-de-principal.html',
})
export class AntesDePrincipalPage {

  PaginaPrincipal:any = PagPrincipalPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private auth:AuthProvider) {
    this.auth.cargarStorageFuncionarios();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AntesDePrincipalPage');
  }

}
