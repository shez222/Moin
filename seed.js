// seed.js

const User = require('./models/User'); // Ensure the correct path
const dbConnect = require('./lib/mongodb'); // Ensure the correct path
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcryptjs for hashing passwords

dotenv.config();

// Define the users to be added
const users = [
  // 10 Regular Users
  {
    email: 'user1@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user2@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user3@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user4@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user5@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user6@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user7@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user8@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user9@example.com',
    password: 'Password123',
    role: 'user',
  },
  {
    email: 'user10@example.com',
    password: 'Password123',
    role: 'user',
  },
  // 2 Admin Users
  {
    email: 'admin1@example.com',
    password: 'AdminPass123',
    role: 'admin',
  },
  {
    email: 'admin2@example.com',
    password: 'AdminPass123',
    role: 'admin',
  },
];

/**
 * Function to hash a plain text password
 * @param {string} plainPassword
 * @returns {string} hashedPassword
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    await dbConnect(); // Connect to MongoDB

    // Check if users already exist to prevent duplicates
    const existingUsers = await User.find({});
    if (existingUsers.length > 0) {
      console.log('Users already exist in the database. Skipping seeding.');
      process.exit(0);
    }

    // Hash passwords for all users
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    );

    // Create users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);

    console.log(`${createdUsers.length} users have been successfully added to the database.`);
    process.exit(0); // Exit the script
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1); // Exit with failure
  }
};

// Run the seed function
seedDatabase();
