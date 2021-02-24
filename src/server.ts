import 'reflect-metadata';
import express from 'express';
import './database';

const app = express();

app.get('/', (request, response) => response.json({ message: 'hello get' }));

app.post('/', (request, response) => response.json({ message: 'hello post' }));

app.listen(3333, () => console.log('Server is running on port 3333'));
