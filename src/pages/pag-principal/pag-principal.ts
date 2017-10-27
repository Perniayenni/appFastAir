import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';


@Component({
  selector: 'page-pag-principal',
  templateUrl: 'pag-principal.html',
})
export class PagPrincipalPage {
  DatosFuncionarios:any=[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthProvider) {
      this.DatosFuncionarios = this.auth.DatosFun;
  }

  CambiarEstado(idMsg, idx){
    this.auth.EditStado(idMsg)
      .subscribe ( resp => {
        console.log(JSON.stringify(resp));
        if (resp=='true'){
          this.auth.msg[idx].confirmacion = 'true';
        }
      });
  }

}
