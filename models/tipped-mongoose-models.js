/**
 * TIPPED — Mongoose Models
 * File: models/tipped-mongoose-models.js
 *
 * Exports:  { User, Report }
 * Database: T.I.P. Manila Campus Incident Reporting System
 */

const mongoose = require('mongoose');

/* ═══════════════════════════════════════════════════════════
   USER SCHEMA
   — Students, Faculty, Staff, and Facilities Admin accounts
   ═══════════════════════════════════════════════════════════ */
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      maxlength: [120, 'Full name cannot exceed 120 characters.']
    },

    tipEmail: {
      type: String,
      required: [true, 'Institutional email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@tip\.edu\.ph$/,
        'Only @tip.edu.ph institutional emails are allowed.'
      ]
    },

    passwordHash: {
      type: String,
      required: [true, 'Password is required.'],
      select: false // Never returned by default in queries
    },

    role: {
      type: String,
      enum: ['User', 'Admin', 'Superadmin'],
      default: 'User'
    },

    department: {
      type: String,
      default: 'General Academic',
      trim: true
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

/* ═══════════════════════════════════════════════════════════
   ADMIN REMARK SUB-SCHEMA
   — Embedded entries for facilities admin action log
   ═══════════════════════════════════════════════════════════ */
const adminRemarkSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    noteText: {
      type: String,
      required: [true, 'Remark text is required.'],
      trim: true,
      maxlength: [2000, 'Remark cannot exceed 2000 characters.']
    },

    actionTaken: {
      type: String,
      enum: [
        'Inspection Scheduled',
        'Technician Dispatched',
        'Parts Ordered',
        'Resolved On-Site',
        'Dismissed - Duplicate',
        'General Note'
      ],
      default: 'General Note'
    }
  },
  {
    timestamps: true // createdAt serves as the remark timestamp
  }
);

/* ═══════════════════════════════════════════════════════════
   REPORT SCHEMA
   — Campus incident / facility maintenance tickets
   ═══════════════════════════════════════════════════════════ */
const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter ID is required.']
    },

    category: {
      type: String,
      required: [true, 'Incident category is required.'],
      enum: [
        'HVAC & Cooling',
        'Electrical & Power',
        'Water & Sanitation',
        'Digital & IT',
        'Furniture & Fixtures',
        'Life Safety & Hazards',
        'Faculty / Academic',
        'General Concern / Other'
      ]
    },

    location: {
      campus: {
        type: String,
        required: [true, 'Campus is required.'],
        enum: ['Arlegui', 'Casal']
      },
      floorLevel: {
        type: String,
        required: [true, 'Floor level is required.']
      },
      roomArea: {
        type: String,
        required: [true, 'Room or area is required.'],
        trim: true
      },
      landmark: {
        type: String,
        default: '',
        trim: true
      }
    },

    description: {
      type: String,
      required: [true, 'Problem description is required.'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters.']
    },

    imageUrls: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length >= 1 && arr.length <= 5;
        },
        message: 'Between 1 and 5 photo evidence URLs are required.'
      }
    },

    priorityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },

    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Dismissed'],
      default: 'Pending'
    },

    adminRemarks: [adminRemarkSchema]
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

/* ═══════════════════════════════════════════════════════════
   INDEXES — Optimise frequent queries
   ═══════════════════════════════════════════════════════════ */
reportSchema.index({ status: 1 });
reportSchema.index({ 'location.campus': 1 });
reportSchema.index({ category: 1 });
reportSchema.index({ reporterId: 1 });
reportSchema.index({ createdAt: -1 });

/* ═══════════════════════════════════════════════════════════
   MODEL EXPORTS
   ═══════════════════════════════════════════════════════════ */
const User = mongoose.model('User', userSchema);
const Report = mongoose.model('Report', reportSchema);

module.exports = { User, Report };
