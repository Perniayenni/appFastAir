import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';


@Component({
  selector: 'page-pag-principal',
  templateUrl: 'pag-principal.html',
})
export class PagPrincipalPage {
  DatosFuncionarios:any=[];



  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider) {
      this.DatosFuncionarios = this.auth.DatosFun;
      console.log(this.DatosFuncionarios);
  }



}
