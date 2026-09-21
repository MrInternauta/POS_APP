import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

import { TranslocoService } from '@jsverse/transloco';
import { dataURLtoFile } from '../util/helpers';

import { ToolsService } from './api.service';
import { SubirarhivoService } from './file.service';
import { ModalInfoService } from './modal.service';

/** jpeg on iOS, png on android, and jpg spelled out so the served type matches the bytes */
function extensionOf(photo: Photo): string {
  const format = String(photo?.format || '').toLowerCase();

  if (format === 'png') {
    return 'png';
  }

  return 'jpeg';
}

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  dataURLtoFile = dataURLtoFile;
  constructor(
    private api: ToolsService,
    public subirArchivo: SubirarhivoService,
    private platform: Platform,
    private modalInfoService: ModalInfoService,
    private transloco: TranslocoService
  ) {}

  /* The `sourceType` parameter in the `takePicture` method of the
  `PictureService` class is used to specify the source from which the picture
  will be taken using the camera. It is of type `CameraSource` which is an enum
  provided by Capacitor's Camera API. */
  private takePicture = async (
    sourceType: CameraSource = CameraSource.Camera,
    id: string,
    type: 'user' | 'product' = 'user',
    callback?: (uploaded?: any) => void
  ) => {
    this.platform.ready().then(() => {
      Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: sourceType,
        height: 500,
        width: 500,
      }).then(
        async (imageData: Photo) => {
          if (!imageData?.dataUrl) return;
          //restrict by size 2MB
          if (imageData?.dataUrl.length > 2097152) {
            this.modalInfoService.error(
              this.transloco.translate('common.somethingWrong'),
              this.transloco.translate('picture.tooHeavy')
            );
            return;
          }

          //The name carries the real format. The API stores the file under that extension and
          //serves it with the matching content type, and iOS refuses to paint an image whose
          //content type does not match its bytes.
          const data = dataURLtoFile(imageData?.dataUrl, `file.${extensionOf(imageData)}`);

          if (!data) {
            this.modalInfoService.error(this.transloco.translate('common.somethingWrong'), '');
            return;
          }

          //The API answers with the record it just updated, image name included
          const uploaded = await this.subirArchivo.uploadImage(data, id, type);

          if (uploaded) {
            callback && callback(uploaded);
          }
        },
        err => {
          //Picking nothing lands here too, which is not worth a message
          console.log(err);
        }
      );
    });
  };

  requestPermission() {
    return Camera.requestPermissions();
  }

  /**
   * @author Felipe De Jesus
   * @version 0.0.1
   * @function changePic
   * @description Abre modal de opciones (Para actualizar la imagen)
   */
  changePicture(id: string, type: 'user' | 'product' = 'user', callback?: (uploaded?: any) => void) {
    this.api.MostrarAlert(
      this.transloco.translate('picture.title'),
      this.transloco.translate('picture.question'),
      () => {
        this.takePicture(CameraSource.Photos, id, type, callback);
      },
      () => {
        this.takePicture(CameraSource.Camera, id, type, callback);
      },
      this.transloco.translate('picture.gallery'),
      this.transloco.translate('picture.camera')
    );
  }
}
