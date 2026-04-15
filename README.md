# Task Manager - Prueba Técnica Next.js

Aplicación fullstack CRUD de tareas desarrollada con Next.js, TypeScript y MongoDB.

## Cómo ejecutar el proyecto

### Requisitos previos

- Node.js 18+
- MongoDB instalado y corriendo localmente (o configuración de MongoDB Atlas)

### Instalación

```bash
npm install
```

### Ejecución

```bash
npm run dev
```

Abrir [http://localhost:3000]

### Otros comandos

```bash
npm run build    # Build para producción
npm run start  # Iniciar servidor de producción
npm run lint   # Verificar código con ESLint
npm test      # Ejecutar tests
```


---

## Estructura del proyecto

```
next-prueba-informa/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts        # GET, POST /api/tasks
│   │       └── [id]/
│   │           └── route.ts  # GET, PATCH, DELETE /api/tasks/:id
│   ├── tasks/
│   │   ├── page.tsx        # Página /tasks
│   │   └── [id]/
│   │       └── page.tsx    # Página /tasks/[id]
│   ├── layout.tsx
│   ├── page.tsx            # Landing page /
│   └── globals.css
├── components/
│   └── TasksList.tsx       # Componente de lista de tareas
├── lib/
│   ├── mongodb.ts          # Conexión a MongoDB
│   ├── task.model.ts       # Modelo Mongoose
│   └── validations.ts      # Funciones de validación
├── types/
│   └── task.ts            # Tipos TypeScript
├── __tests__/
│   └── validations.test.ts # Tests unitarios
├── jest.config.ts
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🛠 Herramientas y decisiones técnicas

### Framework: Next.js 16.2.3 (App Router)

- Utilization de Route Handlers para API REST
- Componentes server y client separados
- Rendering híbrido (static para landing, dynamic para tasks)

### Lenguaje: TypeScript

- Tipado estricto (`strict: true`)
- Tipos definidos en `/types/task.ts`
- Interfaces para documentos Mongoose

### Base de datos: MongoDB + Mongoose

- Modelo con esquema definido en `lib/task.model.ts`
- Connection pooling cacheado en `lib/mongodb.ts`
- Timestamps automáticos para `createdAt` y `updatedAt`

### Testing: Jest + ts-jest

- Configuración en `jest.config.ts`
- Tests de validación en `__tests__/validations.test.ts`
- 12 tests cubriendo validación de entrada

### Estilado: Tailwind CSS 4

- Utility-first approach
- Diseño responsive mobile-first
- Sin librerías de componentes adicionales

---

## API REST

| Método | Endpoint | Descripción |
|--------|---------|-----------|
| POST | `/api/tasks` | Crear nueva tarea |
| GET | `/api/tasks` | Listar todas las tareas |
| GET | `/api/tasks/:id` | Obtener tarea por ID |
| PATCH | `/api/tasks/:id` | Actualizar estado |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

###Body para crear/actualizar tarea

```json
{
  "titulo": "string (obligatorio, máx 100 chars)",
  "descripcion": "string (opcional, máx 500 chars)",
  "estado": "PENDIENTE | COMPLETADA"
}
```

### Códigos de respuesta

- `200` - Éxito
- `201` - Creado
- `400` - Error de validación
- `404` - No encontrado
- `500` - Error del servidor

---

## Modelo de datos (Task)

| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-----------|
| `_id` | ObjectId | Sí | ID único (MongoDB) |
| `titulo` | string | Sí | Título de la tarea |
| `descripcion` | string | No | Descripción opcional |
| `estado` | string | Sí | PENDIENTE o COMPLETADA |
| `createdAt` | Date | Sí | Fecha de creación |
| `updatedAt` | Date | Sí | Fecha de actualización |

---

## Validaciones implementadas

- Título obligatorio (no vacío, no solo espacios)
- Título máximo 100 caracteres
- Descripción máximo 500 caracteres
- Estado debe ser PENDIENTE o COMPLETADA

---

## Tests

Ejecutar todos los tests:

```bash
npm test
```

Ejecutar un archivo específico:

```bash
npm test -- __tests__/validations.test.ts
```

Ejecutar en modo watch:

```bash
npm test -- --watch
```

---

## Dependencias

### Producción

- `next` (16.2.3) - Framework
- `react` (19.2.4) - UI
- `mongoose` (9.4.1) - MongoDB ODM

### Desarrollo

- `typescript` (5)
- `tailwindcss` (4)
- `eslint` (9)
- `jest` - Testing
- `ts-jest` - TypeScript para Jest

---

## Páginas

### `/` - Landing

Página de inicio simple con enlace a /tasks.

### `/tasks` - Lista de tareas

- Formulario para crear tareas
- Lista de todas las tareas
- Botón para marcar como completada/pendiente
- Enlace al detalle de cada tarea
- Botón para eliminar tarea
- Estados de carga y error

### `/tasks/[id]` - Detalle de tarea

- Muestra título, descripción y estado
- Fechas de creación y actualización
- Botón para cambiar estado
- Botón para eliminar tarea
- Manejo de errores (404 si no existe)

---

## Decisiones de diseño

1. **UI simple sin librerías**: Solo Tailwind CSS para mantener el proyecto ligero
2. **Validación en backend**: Siempre validar en el servidor aunque el frontend también valide
3. **TypeScript estricto**: Sin `any` para mejor mantenibilidad
4. **Code splitting**: Componentes client para interactividad
5. **Mongoose cache**: Evita reconnections innecesarias

---