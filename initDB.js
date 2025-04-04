const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = 'neighboralert';

async function initTimeSeries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const collections = await db.listCollections({ name: 'alerts' }).toArray();

    if (collections.length === 0) {
      await db.createCollection('alerts', {
        timeseries: {
          timeField: 'createdAt',
          metaField: 'type',
          granularity: 'seconds'
        },
        expireAfterSeconds: 86400 // ⚠️ placé ici, pas dans createIndex
      });

      console.log('✅ Collection "alerts" Time Series créée avec expiration automatique.');
    } else {
      console.log('ℹ️ La collection "alerts" existe déjà.');
    }
  } catch (err) {
    console.error('❌ Erreur lors de la création Time Series:', err);
  } finally {
    await client.close();
  }
}

initTimeSeries();
