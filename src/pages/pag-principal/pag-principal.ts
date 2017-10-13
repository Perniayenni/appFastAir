import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { mensaje } from '../../clases/mensaje';

@Component({
  selector: 'page-pag-principal',
  templateUrl: 'pag-principal.html',
})
export class PagPrincipalPage {
  DatosFuncionarios:any=[];
  msg:mensaje[]=[];


  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider) {
      this.DatosFuncionarios = this.auth.DatosFun;
      console.log(this.DatosFuncionarios);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PagPrincipalPage');
  }

}
