import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions,
} from '@awesome-cordova-plugins/file-transfer/ngx';
@Injectable({
  providedIn: 'root',
})
export class SubirarhivoService {
  timeStamp: any;
  linkPicture = '';
  // tslint:disable-next-line: deprecation
  constructor(private transfer: FileTransfer) {}

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function subirImagen
   * @description prepara la petición para subir la imagen con la libreria FileTransfer
   * @param {any} archivo la imagen a subir
   */
  public uploadImage(archivo: any, url: string) {
    const options: FileUploadOptions = {};
    const fileTrasfer: FileTransferObject = this.transfer.create();
    return fileTrasfer.upload(archivo, url, options);
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function k
   * @description Obtiene la url de la imagen
   */
  public getLinkPicture(url: string) {
    let timeStamp = new Date().getTime();
    if (this.timeStamp) {
      return url + '?' + timeStamp;
    }
    return url;
  }
}
