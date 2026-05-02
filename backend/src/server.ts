import cors from 'cors';
import express from 'express';
import todosRouter from './todos.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:8080';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/todos', todosRouter);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
