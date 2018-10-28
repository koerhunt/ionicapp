import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import User from '../../models/user';
import Profile from '../../models/profile';

import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from 'ionic-angular';

import {HomePage} from '../home/home';
import {AngularFireDatabaseModule} from '@angular/fire/database'
import {AngularFireDatabase} from '@angular/fire/database'
import profile from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  user = {} as User;
  profile = {} as Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams, private aFoth: AngularFireAuth,private toastCtrl: ToastController,
  private afdatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
  }

  async registrarse(user: User, profile: Profile){
    
    try{
      const result =  await this.aFoth.auth.createUserWithEmailAndPassword(user.email,user.password);
      
      if(result){

        //guardar informacion del usuario
        try{
          profile.id = result.user.uid;
          await this.afdatabase.object(`/profiles/${profile.id}`).set({info: profile});
        }catch(e){
          console.log(e);
        }

        this.navCtrl.setRoot(HomePage);
      }

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
