import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';
import { GenericResponse, IExercise } from 'src/app/core/models';

const API_URL = `${API_PREFIX}workout/`;

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(public http: HttpClient) {}

  getExercises() {
    return this.http.get<GenericResponse<Array<IExercise> | null>>(API_URL);
  }
}
