const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});

  const password = await bcrypt.hash('Admin@123', 12);

  await User.insertMany([
    { name: 'Admin User', email: 'admin@example.com', password, role: 'admin', status: 'active' },
    { name: 'Manager User', email: 'manager@example.com', password: await bcrypt.hash('Manager@123', 12), role: 'manager', status: 'active' },
    { name: 'Regular User', email: 'user@example.com', password: await bcrypt.hash('User@1234', 12), role: 'user', status: 'active' },
  ]);

  console.log('Seeded: admin@example.com / Admin@123, manager@example.com / Manager@123, user@example.com / User@1234');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
