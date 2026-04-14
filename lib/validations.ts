import type { TaskInput, TaskStatus } from '@/types/task';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTask(task: TaskInput): ValidationResult {
  const errors: string[] = [];

  if (!task.titulo || task.titulo.trim() === '') {
    errors.push('El título es obligatorio');
  }

  if (task.titulo && task.titulo.length > 100) {
    errors.push('El título no puede exceder 100 caracteres');
  }

  if (task.descripcion && task.descripcion.length > 500) {
    errors.push('La descripción no puede exceder 500 caracteres');
  }

  if (task.estado && !['PENDIENTE', 'COMPLETADA'].includes(task.estado)) {
    errors.push('El estado debe ser PENDIENTE o COMPLETADA');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateTaskStatus(estado: unknown): estado is TaskStatus {
  return estado === 'PENDIENTE' || estado === 'COMPLETADA';
}