import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import { AngularFireAuth } from "@angular/fire/auth"
import { LoginPage } from '../login/login';
import { UserDocumentsPage } from '../user-documents/user-documents';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
  private afauth:AngularFireAuth, private toastCtr:ToastController ) {
  }

  irADocumentos(){
    this.navCtrl.push(UserDocumentsPage);
  }

  cerrarSession(){
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewWillLoad(){
    this.afauth.authState.subscribe(
      data => {
        if(data.email){
          this.toastCtr.create({
            message: `Bienvenido ${data.email}`,
            position: "top",
            duration: 3000
          }).present();
        }else{
          this.toastCtr.create({
            message: `No esta logeado`,
            position: "top",
            duration: 3000
          }).present();
        }
      }
    );
  }

}
