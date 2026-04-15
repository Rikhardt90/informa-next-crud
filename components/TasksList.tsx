'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { TaskStatus } from '@/types/task';

interface Task {
  _id: string;
  titulo: string;
  descripcion?: string;
  estado: TaskStatus;
  createdAt: string;
}

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ titulo: '', descripcion: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Error al cargar tareas');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.titulo.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear tarea');
      }

      setNewTask({ titulo: '', descripcion: '' });
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCreating(false);
    }
  };

  const toggleComplete = async (id: string, currentStatus: TaskStatus) => {
    const newStatus: TaskStatus = currentStatus === 'PENDIENTE' ? 'COMPLETADA' : 'PENDIENTE';

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!res.ok) throw new Error('Error al actualizar estado');
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar tarea');
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-600">Cargando...</div>;
  }

  return (
    <div>
      <form onSubmit={createTask} className="mb-8 rounded-lg bg-white p-4 shadow">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Título de la tarea"
            value={newTask.titulo}
            onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
            className="w-full rounded border border-zinc-300 px-3 py-2 focus:border-secondary focus:outline-none text-black"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Descripción (opcional)"
            value={newTask.descripcion}
            onChange={(e) => setNewTask({ ...newTask, descripcion: e.target.value })}
            className="w-full rounded border border-zinc-300 px-3 py-2 focus:border-secondary focus:outline-none text-black"
            rows={2}
          />
        </div>
        <button
          type="submit"
          disabled={creating || !newTask.titulo.trim()}
          className="w-full rounded bg-secondary px-4 py-2 text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {creating ? 'Creando...' : 'Crear Tarea'}
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center text-zinc-500">No hay tareas todavía</div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-medium ${
                      task.estado === 'COMPLETADA' ? 'text-zinc-400 line-through' : 'text-zinc-900'
                    }`}
                  >
                    {task.titulo}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      task.estado === 'COMPLETADA'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {task.estado}
                  </span>
                </div>
                {task.descripcion && (
                  <p className="mt-1 text-sm text-zinc-600">{task.descripcion}</p>
                )}
              </div>
              <div className="hidden md:flex ml-4 gap-2">
                <button
                  onClick={() => toggleComplete(task._id, task.estado)}
                  className="rounded px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
                >
                  {task.estado === 'PENDIENTE' ? 'Completar' : 'Pendiente'}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="rounded px-3 py-1 text-sm text-accent hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
              <Link
                href={`/tasks/${task._id}`}
                className="rounded px-3 py-1 text-sm text-secondary hover:bg-blue-50"
              >
                Ver
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}