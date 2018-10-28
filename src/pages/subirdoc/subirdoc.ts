import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
// import { storage } from 'firebase'
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { AngularFireStorage }from '@angular/fire/storage'

/**
 * Generated class for the SubirdocPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subirdoc',
  templateUrl: 'subirdoc.html',
})
export class SubirdocPage {

  FileUri = null;
  ResolvedUri = null;
  loading = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private fileChooser: FileChooser,
    private toastCtrl: ToastController,
    private file: File,
    private filePath: FilePath,
    public loadingCtrl: LoadingController,
  private storage: AngularFireStorage) {
  }

  selectFile(){
    this.fileChooser.open().then(
      uri => {
        console.log(uri);
        this.FileUri = uri;
        this.resolvePath();
      }
    ).catch(e => console.log(e));
  }

  resolvePath(){
    this.filePath.resolveNativePath(this.FileUri).then(
      rPath => {
        this.ResolvedUri = rPath;
        this.storeFile();
      }
    ).catch(err => console.log(err));

  }

  storeFile(){

    let path =  this.ResolvedUri.split("/");
    let filename = path.pop();
    path = path.join("/");

    this.loading = this.loadingCtrl.create({content: "Leyendo archivo..."});
    this.loading.present();

    this.file.readAsDataURL(path,filename).then(strdata => {

      this.loading.dismiss();
      this.loading = this.loadingCtrl.create({content: "Subiendo, por favor espere..."});
      this.loading.present();
      
      this.storage.ref("pdfs").child(filename).putString(strdata, 'data_url').then((d)=>{

        this.loading.dismiss();

        this.toastCtrl.create({
          duration: 3000,
          position: 'middle',
          message: "El archivo se ha guardado"
        }).present();

      },(e)=>{

      })

    })
  }
  ionViewDidLoad() {
  }

}

/*
this.file.readAsDataURL(rPath,file).then(strdata => {
          this.toastCtrl.create({
            duration: 3000,
            position: 'top',
            message: "Archivo leido"
          }).present();
         
        }).catch();
*/