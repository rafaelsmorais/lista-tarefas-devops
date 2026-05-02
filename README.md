# Projeto Final DevOps - Todo App

Aplicacao web de lista de tarefas criada para a disciplina de DevOps. O projeto possui front-end, back-end e banco de dados executando com Docker Compose.

## Objetivo da aplicacao

Permitir o gerenciamento de tarefas por meio de um CRUD completo:

- criar tarefas;
- listar tarefas;
- atualizar titulo, descricao e status;
- remover tarefas.

## Tecnologias utilizadas

- React
- Vite
- TypeScript
- Node.js
- Express
- SQLite
- Docker
- Docker Compose

## Estrutura do projeto

```text
.
├── backend/                 # API Node.js com Express e SQLite
├── database/                # Container de inicializacao do SQLite
├── frontend/                # Aplicacao React com Vite
├── docker-compose.yml       # Orquestracao dos servicos
└── README.md
```

## Execucao com Docker Compose

Subir todos os servicos:

```bash
docker compose up --build
```

Acessos:

- Front-end: http://localhost:8080
- Back-end: http://localhost:3000
- Health check da API: http://localhost:3000/health

Parar os servicos:

```bash
docker compose down
```

Remover tambem o volume do banco:

```bash
docker compose down -v
```

## Comandos principais

Backend:

```bash
cd backend
npm install
npm run dev
npm run build
npm run lint
```

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

## GitFlow

Fluxo sugerido para o projeto:

- `main`: branch estavel para entrega;
- `develop`: branch principal de desenvolvimento;
- `feature/*`: branches para novas funcionalidades;
- `release/*`: branches de preparacao de entrega;
- `hotfix/*`: correcoes urgentes.

Exemplo:

```bash
git checkout -b develop
git checkout -b feature/crud-tarefas
```
