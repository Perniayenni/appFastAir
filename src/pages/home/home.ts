import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AntesDePrincipalPage } from '../../pages/antes-de-principal/antes-de-principal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  bp:string = "";
  rut:string = "";
  antesDePrincipalPage:any = AntesDePrincipalPage;

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
        if(this.auth.funRegistro != ''){
          this.navCtrl.setRoot( this.antesDePrincipalPage );
        }
    } )
  }

  verificarEntrada() {
    let rut1 = this.rut;
    let rut2 = rut1.split('.').join('');
    let rut = rut2.split('-').join('');
    let sRut1 = rut;      // contador de para saber cuando insertar el . o la -
    let nPos = 0; // Guarda el rut invertido con los puntos y el guión agregado
    let sInvertido = ''; // Guarda el resultado final del rut como debe ser
    let sRut = '';
    for (var i = sRut1.length - 1; i >= 0; i-- ) {
      sInvertido += sRut1.charAt(i);
      if (i == sRut1.length - 1 )
        sInvertido += '-';
      else if (nPos == 3)
      {
        sInvertido += '.';
        nPos = 0;
      }
      nPos++;
    }
    for(var j = sInvertido.length-1; j>=0; j-- )
    {
      if (sInvertido.charAt(sInvertido.length - 1) != '.')
        sRut += sInvertido.charAt(j);
      else if (j != sInvertido.length - 1 )
        sRut += sInvertido.charAt(j);
    }
    // Pasamos al campo el valor formateado
    this.rut= sRut;
  }
}
