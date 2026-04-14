# AGENTS.md - Development Guidelines

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

- **Framework**: Next.js 16.2.3 (App Router)
- **Language**: TypeScript 5
- **Runtime**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9
- **Database**: MongoDB + Mongoose
- **Testing**: Jest

---

## Build / Lint / Test Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
```

### Build & Production
```bash
npm run build       # Build for production
npm run start       # Start production server
```

### Linting
```bash
npm run lint        # Run ESLint on entire project
```

### Testing
```bash
npm test            # Run all tests
npm test -- --watch # Run tests in watch mode
npm test -- path/to/test.ts # Run single test file
npm test -- -t "test name"  # Run test by name pattern
```

---

## Code Style Guidelines

### General Principles
- Keep code simple and readable (junior-mid level)
- Avoid over-engineering or unnecessary abstractions
- Follow existing patterns in the codebase
- Use meaningful variable and function names

### Formatting
- Use **2 spaces** for indentation (TypeScript standard)
- **No semicolons** at end of statements
- Use **single quotes** for strings, except when containing single quotes
- Maximum line length: 100 characters (soft limit)
- Add trailing commas in objects and arrays
- Use arrow functions for callbacks

### Example
```typescript
// Good
const fetchTasks = async () => {
  const response = await fetch('/api/tasks');
  return response.json();
};

// Bad
const fetchTasks = async function() {
  var response = await fetch('/api/tasks');
  return response.json();
};
```

---

## Import Conventions

### Order (group by type)
1. React/Next imports (`next/link`, `next/image`)
2. External libraries
3. Internal imports (relative paths)
4. Type imports

### Syntax
```typescript
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Task } from '@/types';
import { taskService } from '@/lib/api';
```

### Path Aliases
- Use `@/` prefix for root-relative imports
- Example: `@/components/Button` instead of `../../components/Button`

---

## TypeScript Conventions

### Type Definitions
```typescript
// Interface for objects
interface Task {
  id: string;
  titulo: string;
  descripcion?: string;
  estado: 'PENDIENTE' | 'COMPLETADA';
}

// Type for API responses
type ApiResponse<T> = {
  data?: T;
  error?: string;
};

// Use 'type' for unions
type TaskStatus = 'PENDIENTE' | 'COMPLETADA';
```

### Type Safety
- Always define return types for functions
- Use `strict: true` in tsconfig (already enabled)
- Avoid `any` type - use `unknown` when type is truly unknown
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### Example
```typescript
// Good
const getTaskById = (id: string): Promise<Task | null> => {
  return fetch(`/api/tasks/${id}`).then(res => res.json());
};

// Avoid
const getTaskById = async (id: string) => {
  const res = await fetch(`/api/tasks/${id}`);
  return res.json();
};
```

---

## Naming Conventions

### Variables & Functions
- **CamelCase** for variables and functions
- **PascalCase** for interfaces, types, and classes
- **UPPER_SNAKE_CASE** for constants
- Use **verbs** for functions: `getTasks()`, `createTask()`, `updateTaskStatus()`

### Files
- **kebab-case** for file names: `task-card.tsx`, `api-helper.ts`
- **PascalCase** for components: `TaskCard.tsx`, `TaskForm.tsx`
- Add `.test.ts` suffix for test files

### Components
- Use descriptive names: `TaskList` not `List`
- Prefix with context: `TasksPage`, `TaskDetailView`

---

## Component Patterns

### Functional Components (Next.js App Router)
```typescript
'use client';

import { useState, useEffect } from 'react';

interface TaskListProps {
  initialTasks: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### Server Components
```typescript
import { getTasks } from '@/lib/api';

export default async function TasksPage() {
  const tasks = await getTasks();
  
  return (
    <main>
      <TaskList initialTasks={tasks} />
    </main>
  );
}
```

---

## Error Handling

### API Routes (Route Handlers)
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tasks = await fetchTasks();
    return NextResponse.json({ data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Error al obtener tareas' },
      { status: 500 }
    );
  }
}
```

### Client-Side
```typescript
const handleSubmit = async () => {
  setError(null);
  setLoading(true);
  
  try {
    await createTask(data);
    router.push('/tasks');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error desconocido');
  } finally {
    setLoading(false);
  }
};
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

---

## UI / Styling (Tailwind CSS)

### Best Practices
- Use **utility-first** approach
- Keep classes readable and grouped
- Use semantic color names when possible

### Common Patterns
```typescript
// Buttons
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Guardar
</button>

// Forms
<input 
  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  type="text"
/>

// Cards
<div className="p-4 bg-white rounded shadow">
  {/* content */}
</div>
```

### Responsive Design
```typescript
// Mobile-first
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

---

## API Routes (Next.js Route Handlers)

### Structure
```
app/
└── api/
    └── tasks/
        ├── route.ts       # GET, POST
        └── [id]/
            └── route.ts   # PATCH, DELETE
```

### Example Route Handler
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const tasks = await getAllTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.titulo) {
    return NextResponse.json(
      { error: 'El título es obligatorio' },
      { status: 400 }
    );
  }
  
  const task = await createTask(body);
  return NextResponse.json(task, { status: 201 });
}
```

---

## Database (MongoDB + Mongoose)

### Connection
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasks';

export async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}
```

### Model Definition
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  titulo: string;
  descripcion?: string;
  estado: 'PENDIENTE' | 'COMPLETADA';
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: { 
    type: String, 
    enum: ['PENDIENTE', 'COMPLETADA'],
    default: 'PENDIENTE'
  },
}, { timestamps: true });

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
```

---

## Testing Guidelines

### Unit Tests (Jest)
```typescript
import { validateTask } from '@/lib/validations';

describe('validateTask', () => {
  it('should return false when titulo is empty', () => {
    const result = validateTask({ titulo: '' });
    expect(result.valid).toBe(false);
  });

  it('should return true when task is valid', () => {
    const result = validateTask({ titulo: 'Test task' });
    expect(result.valid).toBe(true);
  });
});
```

### Test File Naming
- `task.validation.test.ts`
- `tasks.api.test.ts`

---

## File Structure

```
project-root/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── tasks/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── tasks/            # Tasks pages
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/            # Reusable UI components
├── lib/                   # Utilities, services, DB connection
│   ├── mongodb.ts
│   └── task.model.ts
├── types/                 # TypeScript type definitions
├── __tests__/            # Test files
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── jest.config.ts
└── next.config.ts
```

---

## Environment Variables

Create `.env.local` for local development:
```bash
MONGODB_URI=mongodb://localhost:27017/tasks
```

---

## Notes for Agents

1. **Read docs first**: When unsure about Next.js 16 APIs, check `node_modules/next/dist/docs/`
2. **Keep it simple**: This is a junior-mid level project - avoid complex architectures
3. **No heavy libraries**: Use built-in solutions when possible (no Redux, no heavy UI kits)
4. **TypeScript is required**: All code must be properly typed
5. **ESLint must pass**: Run `npm run lint` before committing
6. **Add at least one test**: Must include Jest unit tests for validation