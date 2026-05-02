import { Router } from 'express';
import { z } from 'zod';
import { db } from './database.js';

const router = Router();

const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Titulo e obrigatorio'),
  description: z.string().trim().optional().default('')
});

const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Titulo e obrigatorio').optional(),
  description: z.string().trim().optional(),
  completed: z.boolean().optional()
});

type TodoRow = {
  id: number;
  title: string;
  description: string | null;
  completed: 0 | 1;
  created_at: string;
  updated_at: string;
};

const mapTodo = (todo: TodoRow) => ({
  id: todo.id,
  title: todo.title,
  description: todo.description ?? '',
  completed: Boolean(todo.completed),
  createdAt: todo.created_at,
  updatedAt: todo.updated_at
});

router.get('/', (_request, response) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all() as TodoRow[];
  response.json(todos.map(mapTodo));
});

router.post('/', (request, response) => {
  const parsed = createTodoSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const result = db
    .prepare('INSERT INTO todos (title, description) VALUES (?, ?)')
    .run(parsed.data.title, parsed.data.description);

  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid) as TodoRow;
  return response.status(201).json(mapTodo(todo));
});

router.put('/:id', (request, response) => {
  const parsed = updateTodoSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(request.params.id) as TodoRow | undefined;

  if (!existing) {
    return response.status(404).json({ message: 'Tarefa nao encontrada' });
  }

  const nextTodo = {
    title: parsed.data.title ?? existing.title,
    description: parsed.data.description ?? existing.description ?? '',
    completed:
      typeof parsed.data.completed === 'boolean'
        ? Number(parsed.data.completed)
        : existing.completed
  };

  db.prepare(
    'UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(nextTodo.title, nextTodo.description, nextTodo.completed, existing.id);

  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(existing.id) as TodoRow;
  return response.json(mapTodo(updated));
});

router.delete('/:id', (request, response) => {
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(request.params.id);

  if (result.changes === 0) {
    return response.status(404).json({ message: 'Tarefa nao encontrada' });
  }

  return response.status(204).send();
});

export default router;
