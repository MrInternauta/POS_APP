import { Injectable } from '@angular/core';
import {
  Camera,
  CameraOptions,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import { ToolsService } from './api.service';
import { SubirarhivoService } from './file.service';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  constructor(
    private api: ToolsService,
    public subirArchivo: SubirarhivoService
  ) {}

  /* The `sourceType` parameter in the `takePicture` method of the
  `PictureService` class is used to specify the source from which the picture
  will be taken using the camera. It is of type `CameraSource` which is an enum
  provided by Capacitor's Camera API. */
  private takePicture = async (
    sourceType: CameraSource = CameraSource.Camera
  ) => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: sourceType,
    }).then(
      (imageData) => {
        this.subirArchivo.uploadImage(imageData, '');
      },
      (err) => {
        console.log(err);
        this.api.presentToast('Error al abrir la camara');
      }
    );
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
  changePicture() {
    this.api.MostrarAlert(
      'Actualizar Fotografía',
      '¿Desde donde deseas seleccionar?',
      () => {
        this.takePicture(CameraSource.Photos);
      },
      () => {
        this.takePicture(CameraSource.Camera);
      },
      'Galeria',
      'Camara'
    );
  }
}
