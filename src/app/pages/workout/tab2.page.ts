import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InProgressComponent } from './add/in-progress.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  message =
    'This modal example uses the modalController to present and dismiss modals.';
  public historyWorkout!: Array<any>;
  constructor(private modalCtrl: ModalController) {
    this.historyWorkout = [
      1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4,
    ];
  }
  async startWorkout() {
    const modal = await this.modalCtrl.create({
      component: InProgressComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }
}
