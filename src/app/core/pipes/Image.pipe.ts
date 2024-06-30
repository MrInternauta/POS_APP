import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@gymTrack/environment';
import { API_PREFIX } from '../constants';

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
    return new Promise(resolve => {
      if (!img) {
        if (type == 'user') {
          return resolve('assets/images/placeholder.jpg');
        }
        return resolve('assets/images/no-image.jpg');
      }
      // La peticion regresa una img y se pasa a una url temporal para poder ser usada
      this.GetImagen(img, type).subscribe(
        value => {
          const reader = new FileReader();
          reader.readAsDataURL(value);
          reader.onloadend = () => {
            const imagenTemp = reader.result;
            resolve(imagenTemp);
          };
        },
        () => {
          if (type == 'user') {
            return resolve('assets/images/placeholder.jpg');
          }
          return resolve('assets/images/no-image.jpg');
        }
      );
    });
  }
}
