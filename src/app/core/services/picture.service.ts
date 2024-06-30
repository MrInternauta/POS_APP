import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

import { dataURLtoFile } from '../util/helpers';
import { ToolsService } from './api.service';
import { SubirarhivoService } from './file.service';
import { ModalInfoService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  dataURLtoFile = dataURLtoFile;
  constructor(
    private api: ToolsService,
    public subirArchivo: SubirarhivoService,
    private platform: Platform,
    private modalInfoService: ModalInfoService
  ) {}

  /* The `sourceType` parameter in the `takePicture` method of the
  `PictureService` class is used to specify the source from which the picture
  will be taken using the camera. It is of type `CameraSource` which is an enum
  provided by Capacitor's Camera API. */
  private takePicture = async (
    sourceType: CameraSource = CameraSource.Camera,
    id: string,
    type: 'user' | 'product' = 'user'
  ) => {
    this.platform.ready().then(() => {
      Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: sourceType,
      }).then(
        async (imageData: Photo) => {
          if (!imageData?.dataUrl) return;
          const data = dataURLtoFile(imageData?.dataUrl, 'file.png');
          this.subirArchivo.uploadImage(data, id, type);
        },
        err => {
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
  changePicture(id: string, type: 'user' | 'product' = 'user') {
    this.api.MostrarAlert(
      'Actualizar Fotografía',
      '¿Desde donde deseas seleccionar?',
      () => {
        this.takePicture(CameraSource.Photos, id, type);
      },
      () => {
        this.takePicture(CameraSource.Camera, id, type);
      },
      'Galeria',
      'Camara'
    );
  }
}
