import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900" >
          Task Manager
        </h1>
        <h2 className="mb-2 text-2xl font-semibold text-zinc-700">
          Prueba técnica para INFORMA D&B - Ricardo Mera Ciudad
        </h2>
        <p className="mb-8 text-lg text-zinc-600">
          Aplicación CRUD de tareas con Next.js, TypeScript y MongoDB
        </p>
        <Link
          href="/tasks"
          className="inline-block rounded-lg bg-secondary px-6 py-3 text-white transition-colors hover:bg-primary"
        >
          Ir a Tareas
        </Link>
      </div>
    </main>
  );
}