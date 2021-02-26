import 'reflect-metadata';
import express from 'express';
import createConnection from './database'
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

export { app };

// isola o app para poder importar tanto na aplicação real como nos testes, com uso do supertest
