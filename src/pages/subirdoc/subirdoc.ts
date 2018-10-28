import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { AngularFireStorage }from '@angular/fire/storage'
import { AngularFireDatabase } from 'angularfire2/database';
import PdfFile from '../../models/pdf_file';
import { DocumentDetailsPage } from '../document-details/document-details';
import profile from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-subirdoc',
  templateUrl: 'subirdoc.html',
})
export class SubirdocPage {

  FileUri = null;
  ResolvedUri = null;
  loading = null;
  all_pdfs = [];

  toUser = {} as profile;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private fileChooser: FileChooser,
    private toastCtrl: ToastController,
    private file: File,
    private filePath: FilePath,
    public loadingCtrl: LoadingController,
    private storage: AngularFireStorage,
    private afdatabase: AngularFireDatabase) {

      this.toUser.id = navParams.get("id");
      this.toUser.nombre = navParams.get("nombre");

  }

  //funcion que despliega el administrador de archivos del
  //telefono y regresa el uri
  selectFile(){
    this.fileChooser.open().then(
      uri => {
        console.log(uri);
        this.FileUri = uri;
        this.resolvePath();
      }
    ).catch(e => console.log(e));
  }

  //resuelve el uri al sistema de archivos del telefono
  //segun la plataforma
  resolvePath(){
    this.filePath.resolveNativePath(this.FileUri).then(
      rPath => {
        this.ResolvedUri = rPath;
        this.storeFile();
      }
    ).catch(err => console.log(err));

  }

  //lee el archivo como un data-url y lo manda al storage
  storeFile(){

    //path
    let path =  this.ResolvedUri.split("/");
    //nombre del archivo
    let filename = path.pop();
    path = path.join("/");

    //despliega loader
    this.loading = this.loadingCtrl.create({content: "Leyendo archivo..."});
    this.loading.present();

    //comienza a leer el contenido del archivo
    this.file.readAsDataURL(path,filename).then(strdata => {

      this.loading.dismiss();
      this.loading = this.loadingCtrl.create({content: "Subiendo, por favor espere..."});
      this.loading.present();
      
      //comienza a enviar el documento al storage
      this.storage.ref("pdfs").child(filename).putString(strdata, 'data_url').then((d)=>{
        
        //guarda en la base de datos el id y direccion
        //del archivo
        
        this.loading.dismiss();
        this.toastCtrl.create({
          duration: 3000,
          position: 'middle',
          message: "El archivo se ha guardado"
        }).present();

        let npdf = {} as PdfFile;
        npdf.name = filename;
        try{
          this.afdatabase.list(`/profiles/${this.toUser.id}/documents`).push(npdf);
          this.refreshData();
        }catch(e){
          console.log(e)
        }

      },(e)=>{

      })

    })
  }

  itemSelected(item){
  }

  refreshData(){
    this.all_pdfs = [];
    var _this = this;
    
    try{

      let uploaded_files = this.afdatabase.database.ref(`/profiles/${this.toUser.id}/documents`);
    
      uploaded_files.once('value',function(snap){
        snap.forEach(function(e){
          let npdf = {name: e.val().name} as PdfFile;
          _this.all_pdfs.push(npdf);
        })
      });
    }catch(e){
      console.log(e);
    }  

  }

  ionViewDidLoad() {
    this.refreshData();

  }

  doRefresh(refresher) {
    this.refreshData();
    refresher.complete();
  }


}