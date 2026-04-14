import mongoose, { Schema, Document } from 'mongoose';
import type { TaskStatus } from '@/types/task';

export interface ITask extends Document {
  titulo: string;
  descripcion?: string;
  estado: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String },
    estado: {
      type: String,
      enum: ['PENDIENTE', 'COMPLETADA'] as const,
      default: 'PENDIENTE',
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);