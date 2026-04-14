export type TaskStatus = 'PENDIENTE' | 'COMPLETADA';

export interface ITask {
  _id: string;
  titulo: string;
  descripcion?: string;
  estado: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskInput {
  titulo: string;
  descripcion?: string;
  estado?: TaskStatus;
}