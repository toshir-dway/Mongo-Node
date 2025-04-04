require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});


const User = require('./models/users');

async function createDemoUser() {
  const user = new User({ name: 'Alice', email: 'alice@example.com' });
  await user.save();
  console.log('👤 User saved:', user);
}

mongoose.connection.once('open', createDemoUser);
