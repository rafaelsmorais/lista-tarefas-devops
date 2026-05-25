import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Titulo e obrigatorio'),
  description: z.string().trim().optional().default('')
});

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Titulo e obrigatorio').optional(),
  description: z.string().trim().optional(),
  completed: z.boolean().optional()
});
