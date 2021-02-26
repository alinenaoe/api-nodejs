import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';

describe("Surveys", () => {

  beforeAll(async ()=> {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  it("Should be able to create a new survey", async () => {

    const response = await request(app).post('/surveys')
    .send({
      title: "Survey title",
      description: "Description",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it("Should not be able to list all the surveys", async () => {

    await request(app).post('/surveys')
    .send({
      title: "Survey title 2",
      description: "Description 2",
    });

    const response = await request(app).get('/surveys');
    expect(response.body.length).toBe(2);
  });

})
