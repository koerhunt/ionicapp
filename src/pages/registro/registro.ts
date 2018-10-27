import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import User from '../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private aFoth: AngularFireAuth,private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  async registrarse(user: User){
    
    try{
      const result =  await this.aFoth.auth.createUserWithEmailAndPassword(user.email,user.password);
      console.log(result);
    }catch(e){
      let toast = this.toastCtrl.create({
        duration: 3000,
        position: 'top'
      });

      switch(e.code){
        case "auth/invalid-email":
        toast.setMessage("Email no valido");
        break;
        case "auth/argument-error":
        toast.setMessage("Informacion incorrecta");
        break;
        case "auth/weak-password":
        toast.setMessage("Contraseña muy corta o insegura, elige una mejor");
        break;
        default:
        console.log(e.code);
        break;
      }

      toast.present();
    }



  }

}
