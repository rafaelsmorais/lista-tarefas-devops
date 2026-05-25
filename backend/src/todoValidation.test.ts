import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createTodoSchema, updateTodoSchema } from './todoValidation.js';

describe('validacao de tarefas', () => {
  it('aceita uma tarefa valida', () => {
    const result = createTodoSchema.safeParse({
      title: 'Estudar Docker',
      description: 'Subir os containers com Compose'
    });

    assert.equal(result.success, true);
  });

  it('rejeita tarefa sem titulo', () => {
    const result = createTodoSchema.safeParse({
      title: '   ',
      description: 'Descricao sem titulo'
    });

    assert.equal(result.success, false);
  });

  it('aceita atualizacao apenas do status', () => {
    const result = updateTodoSchema.safeParse({
      completed: true
    });

    assert.equal(result.success, true);
  });
});
