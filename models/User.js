// /models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Prevent password from being returned in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'doctor'], // Define roles as needed
      default: 'user',
    },
    formDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    }
    // Add other fields as necessary
  },
  { timestamps: true }
);

/**
 * Encrypt password using bcrypt before saving the user
 */
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next(); // Use return to prevent further execution
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method to compare entered password with hashed password in DB
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Prevent model overwrite upon initial compile
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
