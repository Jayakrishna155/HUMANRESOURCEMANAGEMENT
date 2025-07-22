// models/LeaveApplication.ts

import mongoose, { Schema, model, models } from 'mongoose';

const leaveApplicationSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    leaveType: {
      type: String,   // ❌ no enum here
      required: true
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'], // ✅ you can keep enum for status if needed
      default: 'pending'
    }
  },
  { timestamps: true }
);


const LeaveApplication =
  models.LeaveApplication || model('LeaveApplication', leaveApplicationSchema);

export default LeaveApplication;
