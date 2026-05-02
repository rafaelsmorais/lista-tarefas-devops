import { FormEvent, useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  async function loadTodos() {
    const response = await fetch(`${apiUrl}/todos`);
    const data = (await response.json()) as Todo[];
    setTodos(data);
  }

  useEffect(() => {
    loadTodos().catch(() => setMessage('Nao foi possivel carregar as tarefas.'));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage('Informe um titulo para a tarefa.');
      return;
    }

    const payload = { title, description };
    const url = editingId ? `${apiUrl}/todos/${editingId}` : `${apiUrl}/todos`;
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setTitle('');
    setDescription('');
    setEditingId(null);
    setMessage(editingId ? 'Tarefa atualizada.' : 'Tarefa criada.');
    await loadTodos();
  }

  async function toggleCompleted(todo: Todo) {
    await fetch(`${apiUrl}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    });

    await loadTodos();
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
    setMessage('');
  }

  async function deleteTodo(id: number) {
    await fetch(`${apiUrl}/todos/${id}`, { method: 'DELETE' });
    setMessage('Tarefa removida.');
    await loadTodos();
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setMessage('');
  }

  return (
    <main className="page">
      <section className="header">
        <div>
          <h1>Lista de Tarefas</h1>
        </div>
        <span>{todos.length} tarefa(s)</span>
      </section>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Titulo da tarefa"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descricao"
          rows={3}
        />
        <div className="actions">
          <button type="submit">{editingId ? 'Salvar' : 'Adicionar'}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {message && <p className="message">{message}</p>}

      <section className="todo-list">
        {todos.length === 0 ? (
          <p className="empty">Nenhuma tarefa cadastrada.</p>
        ) : (
          todos.map((todo) => (
            <article key={todo.id} className={todo.completed ? 'todo done' : 'todo'}>
              <div>
                <h2>{todo.title}</h2>
                <p>{todo.description || 'Sem descricao.'}</p>
              </div>
              <div className="todo-actions">
                <button type="button" onClick={() => toggleCompleted(todo)}>
                  {todo.completed ? 'Reabrir' : 'Concluir'}
                </button>
                <button type="button" className="secondary" onClick={() => startEdit(todo)}>
                  Editar
                </button>
                <button type="button" className="danger" onClick={() => deleteTodo(todo.id)}>
                  Excluir
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
