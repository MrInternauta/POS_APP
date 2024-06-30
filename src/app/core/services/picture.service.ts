import { Injectable } from '@angular/core';
import { Camera, CameraOptions, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ToolsService } from './api.service';
import { SubirarhivoService } from './file.service';
import { Platform } from '@ionic/angular';
import { ModalInfoService } from './modal.service';
import { dataURLtoFile } from '../util/helpers';

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
          // let blob = await fetch(imageData?.webPath).then(r => r.blob());
          console.log(data);
          // const imgFile = dataURLtoFile(base64 encoded, "image.{ext}")
          // const dataTransfer = new DataTransfer();
          // dataTransfer.items.add(imgFile);
          // console.log(imageData);

          this.subirArchivo.uploadImage(data, id, type);
        },
        err => {
          console.log(err);
          this.modalInfoService.success('Error al seleccionar la imagen/Abrir la Galeria', '');

          //this.api.presentToast('Error al abrir la camara');
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
