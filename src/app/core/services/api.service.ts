import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';

import {
  LoadingController,
  ToastController,
  AlertController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  loading: any;
  alert: any;
  alertInternet: any;
  alerVersionApp: any;
  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    private navCtrl: NavController,
    private network: Network
  ) {}

  //Navega hacia una pagina y destruye la anterior
  navegateAndDestroy(url = '/home') {
    this.navCtrl.navigateRoot(url, {
      animated: true,
      animationDirection: 'forward',
    });
  }

  verifyNetwork() {
    let wasDismissed = false;
    // watch network for a disconnection
    this.network.onDisconnect().subscribe(async () => {
      wasDismissed = true;
      this.InternetAlert();
      console.log('Sin conexion');
    });

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(async () => {
      //Quitar alert solo cuando ya se aya puessto el alert
      if (wasDismissed) {
        this.alertInternet.dismiss();
      }
      //Validar la version si aun no se ha validado
      if (!this.alerVersionApp) {
      }
    });
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function MostarLoading
   * @description Muestra loading
   * @param {string} datav información del loading
   */
  async MostarLoading(datav: string = 'Cargando...') {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        cssClass: 'alerta-personalizada',
        message: datav,
        translucent: false,
        // spinner: 'dots',
        showBackdrop: true,
      });
      await this.loading.present();
    }
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function QuitarLoading
   * @description Quita loading
   * @param {string} datav información del loading
   */
  async QuitarLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function presentToast
   * @description Muestra toast informativo
   * @param {string} message información del toast
   * @param {number} duration duraccion del toast en milisegundos
   */
  async presentToast(message: string = '', duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
    });
    toast.present();
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function MostrarAlert
   * @description Muestra alerta informativa y permite cambiar el nombre de los botones asi como la accion a realizar en cada uno
   * @param {string} header información del header
   * @param {string} subHeader información del subheader
   * @param {string} message información del cuerpo
   * @param {Function} cancelCallback este parametro es una fuccion cuando el usuario preciona el boton
   *                                 cancelar (por defecto cuando el usuario cancela dicha alerta se ejecuta)
   * @param {Function} aceptCallback este parametro es una fuccion cuando el usuario preciona el boton aceptar
   * @param {string} textcancel Nombre el boton con el rol de cancelar (por defecto "Cancelar")
   * @param {string} textAcept Nombre el boton con el rol de aceptar (por defecto "Aceptar")
   */
  // tslint:disable-next-line: max-line-length
  async MostrarAlert(
    header: string,
    message: string,
    cancelCallback: Function,
    aceptCallback: Function,
    textcancel: string = 'Cancelar',
    textAcept: string = 'Aceptar',
    cssClass: string = 'alerta-personalizada-aceptcancel',
    subHeader = ''
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      // backdropDismiss: false,
      cssClass,
      buttons: [
        {
          text: textcancel,
          cssClass: 'danger',
          handler: () => {
            cancelCallback();
          },
        },
        {
          text: textAcept,
          cssClass: 'success',
          handler: () => {
            aceptCallback();
          },
        },
      ],
    });
    await alert.present();
  }
  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function presentAlert
   * @description Muestra alerta informativa
   * @param {string} header información del header
   * @param {string} subHeader información del subheader
   * @param {string} message información del cuerpo
   * @param {boolena} backdropDismiss permitir quitar alerta

   */
  async presentAlert(
    header: string,
    subHeader: string,
    message: string,
    backdropDismiss = true,
    buttons = [
      {
        text: 'OK',
        cssClass: 'success',
        handler: () => {},
      },
    ]
  ) {
    let alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons,
      backdropDismiss,
    });
    await alert.present();
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function InternetAlert
   * @description Muestra alerta informativa cuando no tiene conexion a internet
   */
  async InternetAlert() {
    this.alertInternet = await this.alertController.create({
      header: 'Sin conexión',
      subHeader: '',
      message: 'Favor de verificar su conexión a internet',
      // buttons:['Ok'],
      backdropDismiss: false,
    });
    await this.alertInternet.present();
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function VersionAppAlert
   * @description Muestra alerta informativa cuando no tiene es la misma version de la app
   */
  async VersionAppAlert() {
    this.alerVersionApp = await this.alertController.create({
      header: 'Actualiza la app',
      subHeader: '',
      message:
        'Tienes una versión anterior, por favor actualiza la app para seguir disfrutando del servicio.',
      // buttons: ['Ok'],
      backdropDismiss: false,
    });
    await this.alerVersionApp.present();
  }
}
