import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import Profile from '../../models/profile';
import { AngularFireDatabase } from 'angularfire2/database';
import { SubirdocPage } from '../subirdoc/subirdoc';


@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  users = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afdatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.refreshData();
  }

  refreshData(){
    
    this.users = [];
    var _this = this;
    
    try{
      let all_users = this.afdatabase.database.ref("/profiles");
    
      all_users.once('value',function(snap){
        snap.forEach(function(e){
          let nuser = {nombre: e.val().info.nombre, id: e.val().info.id} as Profile;
          _this.users.push(nuser);
        })
      });
    }catch(e){
      console.log(e);
    }  

  }

  doRefresh(refresher) {
    this.refreshData();
    refresher.complete();
  }


  itemSelected(item){
    this.navCtrl.push(SubirdocPage, {
      id: item.id,
      nombre: item.nombre
    });
  }

}
