// /models/Doctor.js

import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

// Define the Doctor schema
const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  residence: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  pmdcNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  province: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fathersName: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fellowshipNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  zip: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  additionalTrainingInfo: {
    name: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true }
  },
  applicantAffiliation: {
    institution: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true }
  },
  isFinalized: {
    type: Boolean,
    default: false,
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  paymentApprovalStatus: { // New field added for payment approval
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  profilePic: { // New field for Profile Picture
    type: String, // URL or file path
    default: "",
  },
  bankSlipPic: { // New field for Bank Slip Picture
    type: String, // URL or file path
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  membershipNumber: { // New membership number field
    type: Number,
    unique: true
  }
});

// Add auto-increment for membershipNumber
DoctorSchema.plugin(AutoIncrement, {
  inc_field: 'membershipNumber',
  start_seq: 1, // Starting value for membershipNumber
});

// Prevent model overwrite upon re-import
export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);








// // /models/Doctor.js

// import mongoose from 'mongoose';

// // Define the Doctor schema
// const DoctorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   residence: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   gender: {
//     type: String,
//     required: true,
//     enum: ['Male', 'Female', 'Other']
//   },
//   pmdcNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   address: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   province: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   country: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   fathersName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   dob: {
//     type: Date,
//     required: true
//   },
//   cnic: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   fellowshipNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   city: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   zip: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   additionalTrainingInfo: {
//     name: { type: String, required: true, trim: true },
//     institution: { type: String, required: true, trim: true },
//     duration: { type: String, required: true, trim: true }
//   },
//   applicantAffiliation: {
//     institution: { type: String, required: true, trim: true },
//     duration: { type: String, required: true, trim: true },
//     designation: { type: String, required: true, trim: true }
//   },
//   isFinalized: {
//     type: Boolean,
//     default: false,
//   },
//   approvalStatus: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending',
//   },
//   paymentApprovalStatus: { // New field added for payment approval
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending',
//   },
//   profilePic: { // New field for Profile Picture
//     type: String, // URL or file path
//     default: "",
//   },
//   bankSlipPic: { // New field for Bank Slip Picture
//     type: String, // URL or file path
//     default: "",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Prevent model overwrite upon re-import
// export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);












// // /models/Doctor.js

// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// // Define the Doctor schema
// const DoctorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   residence: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   gender: {
//     type: String,
//     required: true,
//     enum: ['Male', 'Female', 'Other']
//   },
//   pmdcNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   address: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   province: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   country: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     // lowercase: true,
//     // trim: true
//   },
//   fathersName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   dob: {
//     type: Date,
//     required: true
//   },
//   cnic: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   fellowshipNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   city: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   zip: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     // unique: true,
//     trim: true
//   },
//   additionalTrainingInfo: {
//     name: { type: String, required: true, trim: true },
//     institution: { type: String, required: true, trim: true },
//     duration: { type: String, required: true, trim: true }
//   },
//   applicantAffiliation: {
//     institution: { type: String, required: true, trim: true },
//     duration: { type: String, required: true, trim: true },
//     designation: { type: String, required: true, trim: true }
//   },
//   isFinalized: {
//     type: Boolean,
//     default: false,
//   },
//   approvalStatus: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending',
//   },
//   paymentApprovalStatus: { // New field added for payment approval
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Prevent model overwrite upon re-import
// export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);








