import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import { AngularFireAuth } from "@angular/fire/auth"


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
  private afauth:AngularFireAuth, private toastCtr:ToastController ) {
  }

  ionViewWillLoad(){
    this.afauth.authState.subscribe(
      data => {
        if(data.email){
          this.toastCtr.create({
            message: `Bienvenido ${data.email}`,
            duration: 3000
          }).present();
        }else{
          this.toastCtr.create({
            message: `No esta logeado`,
            duration: 3000
          }).present();
        }
      }
    );
  }

}
