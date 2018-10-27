import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import User from '../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private aFoth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  async registrarse(user: User){
    
    try{
      const result =  await this.aFoth.auth.createUserWithEmailAndPassword(user.email,user.password);
      console.log(result);
    }catch(e){
      console.log(e);
    }



  }

  goToBack(){
    
  }


}
