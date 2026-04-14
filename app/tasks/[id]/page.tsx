'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { TaskStatus } from '@/types/task';

interface Task {
  _id: string;
  titulo: string;
  descripcion?: string;
  estado: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export default function TaskDetail({ params }: { params: Promise<{ id: string }> }) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      fetchTask(resolvedParams.id);
    });
  }, [params]);

  const fetchTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Tarea no encontrada');
        } else {
          throw new Error('Error al cargar tarea');
        }
        return;
      }
      const data = await res.json();
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async () => {
    if (!task) return;

    const newStatus: TaskStatus = task.estado === 'PENDIENTE' ? 'COMPLETADA' : 'PENDIENTE';

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!res.ok) throw new Error('Error al actualizar estado');
      fetchTask(task._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const deleteTask = async () => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const res = await fetch(`/api/tasks/${task!._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar tarea');
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const router = useRouter();

  if (loading) {
    return <div className="text-center text-zinc-600">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8">
        <div className="mx-auto max-w-md">
          <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
          <Link href="/tasks" className="mt-4 inline-block text-secondary hover:underline">
            Volver a tareas
          </Link>
        </div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-md">
        <Link href="/tasks" className="mb-4 inline-block text-sm text-secondary hover:underline">
          ← Volver a tareas
        </Link>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h1 className={`text-2xl font-bold ${task.estado === 'COMPLETADA' ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
              {task.titulo}
            </h1>
            <span
              className={`rounded px-3 py-1 text-sm ${
                task.estado === 'COMPLETADA'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {task.estado}
            </span>
          </div>

          {task.descripcion && (
            <p className="mb-6 text-zinc-600">{task.descripcion}</p>
          )}

          <div className="mb-4 text-sm text-zinc-500">
            <p>Creada: {new Date(task.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</p>
            <p>Actualizada: {new Date(task.updatedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</p>
          </div>

          {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={toggleComplete}
              className="flex-1 rounded bg-secondary px-4 py-2 text-white transition-colors hover:bg-primary"
            >
              {task.estado === 'PENDIENTE' ? 'Marcar como completada' : 'Marcar como pendiente'}
            </button>
            <button
              onClick={deleteTask}
              className="flex-1 rounded border border-accent px-4 py-2 text-accent transition-colors hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}