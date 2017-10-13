import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  bp:string = "";
  rut:string = "";

  constructor(public navCtrl: NavController,
              private auth: AuthProvider) {

  }

  getDatos(){
    let datos = {
      bp: this.bp,
      rut: this.rut
    }

    this.auth.getFuncionario(datos)
      .subscribe(res =>{
        console.log(res);
    } )
  }

}
