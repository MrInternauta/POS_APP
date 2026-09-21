import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@gymTrack/environment';

import { API_PREFIX } from '../constants';
import { forgetImage, getCachedImage, imageCacheKey, rememberImage } from './image-cache';

const PLACEHOLDER = {
  user: 'assets/images/placeholder.jpg',
  product: 'assets/images/no-image.jpg',
};

@Pipe({
  name: 'images',
})
export class ImagesPipe implements PipeTransform {
  constructor(public http: HttpClient) {}

  // productos - perfil
  transform(img: string, tipo: 'user' | 'product' = 'user'): any {
    return this.getImage(img, tipo);
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function GetImagen
   * @description
   */
  GetImagen(imageName: string, typeImg: string) {
    const API_URL = `${environment.url}${API_PREFIX}image/${typeImg}/${imageName}`;

    // tslint:disable-next-line:align
    return this.http.get(API_URL, {
      headers: {
        'Content-Type': 'image/png',
      },
      responseType: 'blob',
    });
  }

  getImage(img: string, type: 'user' | 'product' = 'user') {
    if (!img) {
      return Promise.resolve(PLACEHOLDER[type]);
    }

    //The profile picture carries a timestamp when it changes, which is what expires its entry
    const key = imageCacheKey(type, img);
    const cached = getCachedImage(key);

    if (cached) {
      return cached;
    }

    const pending = new Promise(resolve => {
      // La peticion regresa una img y se pasa a una url temporal para poder ser usada
      this.GetImagen(img, type).subscribe(
        value => {
          const reader = new FileReader();
          reader.readAsDataURL(value);
          reader.onloadend = () => {
            resolve(reader.result);
          };
        },
        () => {
          //A picture that failed is not remembered, the next row is free to try again
          forgetImage(key);
          resolve(PLACEHOLDER[type]);
        }
      );
    });

    rememberImage(key, pending);

    return pending;
  }
}
