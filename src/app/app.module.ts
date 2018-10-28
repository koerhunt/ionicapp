import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegistroPage } from '../pages/registro/registro';
import { UsersPage } from '../pages/users/users';
import { UserDocumentsPage } from '../pages/user-documents/user-documents';

import { firebaseConfig } from '../firebase.conf';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SubirdocPage } from '../pages/subirdoc/subirdoc';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath} from '@ionic-native/file-path'
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegistroPage,
    SubirdocPage,
    UsersPage,
    UserDocumentsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegistroPage,
    SubirdocPage,
    UsersPage,
    UserDocumentsPage
  ],
  providers: [
    FileChooser,
    StatusBar,
    SplashScreen,
    File,
    FilePath,
    FileTransfer,
    FileOpener,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  exports: [
    LoginPage,
    RegistroPage
  ]
})
export class AppModule {}
