import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import User from '../../models/user'

import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from 'ionic-angular';

import { RegistroPage } from '../registro/registro';
import { HomePage } from '../home/home';
import { UserDocumentsPage } from '../user-documents/user-documents';
import { UsersPage } from '../users/users';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams,private aFoth: AngularFireAuth,private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(){
    try{

      if(this.user.email=="administrador"&&this.user.password=="adminpass"){
        this.navCtrl.setRoot(UsersPage);
      }else{
        const result = await this.aFoth.auth.signInWithEmailAndPassword(
          this.user.email,
          this.user.password
        )
  
        if(result){
          // this.navCtrl.setRoot(HomePage);
          this.navCtrl.setRoot(UserDocumentsPage);
        }
      }

    }catch(e){
      
      let toast = this.toastCtrl.create({
        duration: 3000,
        position: 'top'
      });

      switch(e.code){
        case 'auth/wrong-password':
        toast.setMessage("Contraseña incorrecta");
        break;
        case "auth/user-not-found":
        toast.setMessage("El email no se encuentra registrado");
        break;
        case "auth/invalid-email":
        toast.setMessage("Email no valido");
        break;
        case "auth/argument-error":
        toast.setMessage("Infomracion incorrecta");
        break;
        default:
        console.log(e.code);
        break;
      }

      toast.present();

    }
  }

  registrarse(){
    this.navCtrl.push(RegistroPage);
  }

}
