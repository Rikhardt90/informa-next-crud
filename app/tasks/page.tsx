import Link from 'next/link';
import TasksList from '@/components/TasksList';

export const metadata = {
  title: 'Tareas - Task Manager',
};

export default async function TasksPage() {
  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900">Mis Tareas</h1>
          <Link
            href="/"
            className="text-sm text-secondary hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
        <TasksList />
      </div>
    </main>
  );
}