const { MongoClient, ObjectId } = require('mongodb');
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const alertsRouter = require('./routes/alerts');
const placesRouter = require('./routes/places');
const Place = require('./models/place');
const { alertsCollection, mongoClient } = require('./controllers/alertsController'); // Import alertsCollection and mongoClient

const app = express();
app.use(express.json());
app.use('/api/alerts', alertsRouter);
app.use('/api/places', placesRouter);

const uri = process.env.MONGO_URI;
const dbName = 'neighboralert';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Initialize MongoDB connection for tests
beforeAll(async () => {
  console.log('✅ Connected to alerts Time Series collection for tests');

  // Connect Mongoose for other models
  await mongoose.connect(uri);
});

afterAll(async () => {
  try {
    // Clean up the database
    if (alertsCollection()) { // Use the getter function
      await alertsCollection().deleteMany({}); // Use the getter function
    }
    await Place.deleteMany({});

    // Log Mongoose connection state
    console.log('Mongoose connection state before closing:', mongoose.connection.readyState);

    // Close Mongoose connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('✅ Mongoose connection closed');
    }

    // Close MongoClient connection explicitly
    if (mongoClient()) { // Use the getter function
      await mongoClient().close(); // Use the getter function
      console.log('✅ MongoClient connection closed');
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
});

describe('API Endpoints', () => {
  // Alerts Tests
  test('GET /api/alerts should return an array', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/alerts should create a new alert', async () => {
    const newAlert = {
      title: 'Test Alert',
      description: 'This is a test alert',
      location: {
        type: 'Point',
        coordinates: [45.764043, 4.835659] // Example coordinates
      },
      type: 'danger',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    const res = await request(app).post('/api/alerts').send(newAlert);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newAlert.title);
    expect(res.body.location.type).toBe('Point');
    expect(res.body.location.coordinates).toEqual(newAlert.location.coordinates);
  });

  test('DELETE /api/alerts/:id should delete an alert', async () => {
    const newAlert = {
      title: 'Test Alert to Delete',
      description: 'This alert will be deleted',
      location: {
        type: 'Point',
        coordinates: [45.764043, 4.835659]
      },
      type: 'danger',
      createdAt: new Date(), // Add the required createdAt field
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };

    const insertedAlert = await alertsCollection().insertOne(newAlert); // Use the getter function

    const res = await request(app).delete(`/api/alerts/${insertedAlert.insertedId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Alert deleted successfully');

    const deletedAlert = await alertsCollection().findOne({ _id: insertedAlert.insertedId }); // Use the getter function
    expect(deletedAlert).toBeNull();
  });

  // Places Tests
  test('GET /api/places should return an array', async () => {
    const res = await request(app).get('/api/places');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/places should create a new place', async () => {
    const newPlace = {
      name: 'Test Place',
      description: 'This is a test place',
      location: {
        type: 'Point',
        coordinates: [48.856613, 2.352222] // Example coordinates
      },
      type: 'adresse'
    };
    const res = await request(app).post('/api/places').send(newPlace);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newPlace.name);
    expect(res.body.location.type).toBe('Point');
    expect(res.body.location.coordinates).toEqual(newPlace.location.coordinates);
  });

  test('PUT /api/places/:id should update a place', async () => {
    const newPlace = new Place({
      name: 'Place to Update',
      description: 'This place will be updated',
      location: {
        type: 'Point',
        coordinates: [48.856613, 2.352222]
      },
      type: 'adresse'
    });
    await newPlace.save();

    const updatedData = {
      name: 'Updated Place',
      description: 'This place has been updated',
      location: {
        type: 'Point',
        coordinates: [48.856613, 2.352222]
      },
      type: 'evenement'
    };

    const res = await request(app).put(`/api/places/${newPlace._id}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.description).toBe(updatedData.description);
    expect(res.body.type).toBe(updatedData.type);
  });

  test('DELETE /api/places/:id should delete a place', async () => {
    const newPlace = new Place({
      name: 'Place to Delete',
      description: 'This place will be deleted',
      location: {
        type: 'Point',
        coordinates: [48.856613, 2.352222]
      },
      type: 'adresse'
    });
    await newPlace.save();

    const res = await request(app).delete(`/api/places/${newPlace._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Place deleted successfully');
  });
});