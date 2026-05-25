import { describe, expect, it } from 'vitest';
import { createTodoSchema, updateTodoSchema } from './todoValidation.js';

describe('validacao de tarefas', () => {
  it('aceita uma tarefa valida', () => {
    const result = createTodoSchema.safeParse({
      title: 'Estudar Docker',
      description: 'Subir os containers com Compose'
    });

    expect(result.success).toBe(true);
  });

  it('rejeita tarefa sem titulo', () => {
    const result = createTodoSchema.safeParse({
      title: '   ',
      description: 'Descricao sem titulo'
    });

    expect(result.success).toBe(false);
  });

  it('aceita atualizacao apenas do status', () => {
    const result = updateTodoSchema.safeParse({
      completed: true
    });

    expect(result.success).toBe(true);
  });
});
