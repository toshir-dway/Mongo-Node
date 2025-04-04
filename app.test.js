const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const alertsRouter = require('./routes/alerts');
const placesRouter = require('./routes/places');

const app = express();
app.use(express.json());
app.use('/api/alerts', alertsRouter);
app.use('/api/places', placesRouter);

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Disconnect from the database
  await mongoose.connection.close();
});

describe('API Endpoints', () => {
  test('GET /api/alerts should return an array', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/alerts should create a new alert', async () => {
    const newAlert = { title: 'Test Alert', description: 'This is a test alert' };
    const res = await request(app).post('/api/alerts').send(newAlert);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newAlert.title);
  });

  test('GET /api/places should return an array', async () => {
    const res = await request(app).get('/api/places');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/places should create a new place', async () => {
    const newPlace = { name: 'Test Place', location: '123 Test Street' };
    const res = await request(app).post('/api/places').send(newPlace);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newPlace.name);
  });
});