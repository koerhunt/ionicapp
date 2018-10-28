import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import PdfFile from '../../models/pdf_file';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';


@IonicPage()
@Component({
  selector: 'page-user-documents',
  templateUrl: 'user-documents.html',
})
export class UserDocumentsPage {

  documents = [];
  user_id = "";
  loading = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afauth:AngularFireAuth,
    private toastCtr:ToastController,
    private afdatabase:AngularFireDatabase,
    private storage: AngularFireStorage,
    private transfer: FileTransfer, private file: File,
    private fileOpener: FileOpener,
    public loadingCtrl: LoadingController) {

  }

  getDocuments(){
    var those = this;
    this.documents=[];
    if(this.user_id!=""){
      
    try{

      let uploaded_files = this.afdatabase.database.ref(`/profiles/${this.user_id}/documents`);
    
      uploaded_files.once('value',function(snap){
        snap.forEach(function(e){
          let npdf = {name: e.val().name} as PdfFile;
          those.documents.push(npdf);
        })
      });
    }catch(e){
      console.log(e);
    }  

    } 
  }

  doRefresh(refresher){
    refresher.complete();
  }

  itemSelected(item){

    var those = this;
    
      try{

        var storageRef = this.storage.ref(`pdfs/${item.name}`);

        storageRef.getMetadata().subscribe(metadata=>{

          those.loading = this.loadingCtrl.create({content: "Obteniendo metadata..."});
          those.loading.present();

          storageRef.getDownloadURL().subscribe(downloadUrl=>{

            const fileTransfer: FileTransferObject = this.transfer.create();
            
            those.loading.dismiss();
            those.loading = this.loadingCtrl.create({content: "Obteniendo archivo..."});
            those.loading.present();
  
            fileTransfer.download(downloadUrl,this.file.externalRootDirectory + item.name).then(function(entry){
              
              those.loading.dismiss();
              those.fileOpener.open(entry.toURL(), metadata.contentType);

              those.toastCtr.create({
                message: entry.toURL(),
                position: "top",
                duration: 3000
              }).present();
  
            }).catch(function(err){
              those.toastCtr.create({
                message: "no se puedo descargar el archivo",
                position: "top",
                duration: 3000
              }).present();
            });
  
          },function(err){
            those.toastCtr.create({
              message: err,
              position: "El archivo no existe",
              duration: 3000
            }).present();
          });

        },err=>{
          this.toastCtr.create({
            message: "no se encontro el archivo",
            position: "top",
            duration: 3000
          }).present();
        }
      );
        
        
      }catch(e){
        this.toastCtr.create({
          message: e,
          position: "top",
          duration: 3000
        }).present();
      }

  }

  refreshData(refresher){
    this.getDocuments();
    refresher.complete();
  }

  ionViewDidLoad() {
    var those = this;

    this.afauth.authState.subscribe(
      data => {
        if(data.uid){
          those.user_id = data.uid;
          those.getDocuments();
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
