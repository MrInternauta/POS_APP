import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@gymTrack/environment';
import { take } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { API_PREFIX } from '../constants';
import { ModalInfoService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class SubirarhivoService {
  timeStamp: any;
  linkPicture = '';
  // tslint:disable-next-line: deprecation
  constructor(
    private modalInfoService: ModalInfoService,
    private http: HttpClient,
    private transloco: TranslocoService
  ) {}

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function subirImagen
   * @description prepara la petición para subir la imagen con la libreria FileTransfer
   * @param {any} archivo la imagen a subir
   */
  public async uploadImage(archivo: any, id: string, type: 'user' | 'product' = 'user') {
    try {
      const fd = new FormData();
      fd.append('file', archivo);
      const API_URL = `${environment.url}${API_PREFIX}image/${type}/${id}`;
      const res = await this.http.post(API_URL, fd).pipe(take(1)).toPromise();
      this.modalInfoService.success(this.transloco.translate('picture.updated'), '');
      return res;
    } catch (error) {
      //The interceptor already showed what went wrong; answering null says it did not happen
      console.log(error);
      return null;
    }
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function k
   * @description Obtiene la url de la imagen
   */
  public getLinkPicture(url: string) {
    const timeStamp = new Date().getTime();
    if (this.timeStamp) {
      return url + '?' + timeStamp;
    }
    return url;
  }
}
