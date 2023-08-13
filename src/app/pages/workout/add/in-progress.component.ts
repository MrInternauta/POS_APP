import { Component, OnInit } from '@angular/core';
import { AppState, IExercise, Id } from '@gymTrack/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadExercise } from '../state/workout.actions';
import { selectListExercise } from '../state/workout.selector';

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss'],
})
export class InProgressComponent implements OnInit {
  data$: Observable<Array<IExercise> | null> =
    this.store.select(selectListExercise);

  name!: string;

  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) {
    this.store.dispatch(loadExercise());
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  ngOnInit() {
    return;
  }

  trackItems(index: number, work: IExercise): Id {
    return work.id;
  }

  crateWorkout() {
    //
  }
}
