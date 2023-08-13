import { Id } from '../index';

export enum RoutineState {
  InProgress = 1,
  Finished = 0,
}

export class IRoutine {
  constructor(
    public id: Id,
    public name: string,
    public description: string,
    public state: RoutineState,
    public workouts: Array<IWorkouts>,
    public createdAt: Date
  ) {}
}

export interface IWorkouts {
  exercise: IExercise;
  repetitions: Array<IRepetitions>;
}

export interface IRepetitions {
  weight: number;
  reps: number;
  rate?: number;
  comment?: string;
}

export class IExercise {
  constructor(
    public id: Id,
    public name: string,
    public description: string,
    public musclesTarget: Array<IMuscles>,
    public equipment: IEquipment,
    public createdAt: Date,
    public link?: string,
    public image1?: string,
    public image2?: string,
    public image3?: string
  ) {}
}

export class IMuscles {
  constructor(
    public id: Id,
    public name: string,
    public description: string,
    public createdAt: Date,
    public link?: string,
    public image1?: string,
    public image2?: string,
    public image3?: string,
    public exercises?: Array<IExercise>
  ) {}
}

export class IEquipment {
  constructor(
    public id: Id,
    public name: string,
    public description: string,
    public createdAt: Date | null,
    public link?: string,
    public image1?: string,
    public image2?: string,
    public image3?: string,
    exercises?: IExercise[]
  ) {}
}
