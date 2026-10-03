/**
 * TIPPED — Mongoose Models
 * File: models/tipped-mongoose-models.js
 *
 * Exports:  { User, Incident, Report }
 * Database: T.I.P. Manila Campus Incident & Facilities Reporting System
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

    username: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    tipEmail: {
      type: String,
      required: [true, 'Institutional email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: [true, 'Password is required.'],
      select: false // Never returned by default in queries
    },

    role: {
      type: String,
      enum: ['student', 'faculty', 'staff', 'admin', 'User', 'Admin', 'Superadmin'],
      default: 'student'
    },

    department: {
      type: String,
      default: 'General Academic',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Sync email and tipEmail before save if either is provided
userSchema.pre('save', function (next) {
  if (this.tipEmail && !this.email) {
    this.email = this.tipEmail;
  } else if (this.email && !this.tipEmail) {
    this.tipEmail = this.email;
  }
  next();
});

/* ═══════════════════════════════════════════════════════════
   STAFF NOTE / REMARK SUB-SCHEMA
   ═══════════════════════════════════════════════════════════ */
const staffNoteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: [true, 'Note text is required.'],
      trim: true
    },
    staffName: {
      type: String,
      default: 'Campus IT / Facilities Admin'
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const adminRemarkSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
    timestamps: true
  }
);

/* ═══════════════════════════════════════════════════════════
   INCIDENT / REPORT SCHEMA
   ═══════════════════════════════════════════════════════════ */
const incidentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: [true, 'Ticket ID is required.'],
      trim: true
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    campus: {
      type: String,
      required: [true, 'Campus is required.'],
      enum: ['Arlegui', 'Casal']
    },

    roomCode: {
      type: String,
      required: [true, 'Room code is required.'],
      trim: true
    },

    category: {
      type: String,
      required: [true, 'Incident category is required.'],
      enum: [
        'Electrical & Power',
        'Water & Sanitation',
        'HVAC & Cooling',
        'Digital & IT',
        'Facilities',
        'Furniture & Fixtures',
        'Life Safety & Hazards',
        'Faculty / Academic',
        'General Concern / Other'
      ]
    },

    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Under Review', 'Dismissed'],
      default: 'Pending'
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent', 'Critical'],
      default: 'Medium'
    },

    assignedTeam: {
      type: String,
      enum: ['ITSO', 'Maintenance', 'SOHAS', 'Canteen Staff', 'OSA', 'Guidance', 'Unassigned'],
      default: 'Unassigned',
      trim: true
    },

    description: {
      type: String,
      required: [true, 'Problem description is required.'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters.']
    },

    evidencePhotos: {
      type: [String],
      default: []
    },

    imageUrls: {
      type: [String],
      default: []
    },

    staffNotes: [staffNoteSchema],
    adminRemarks: [adminRemarkSchema],

    location: {
      campus: { type: String, enum: ['Arlegui', 'Casal'] },
      floorLevel: { type: String, default: '' },
      roomArea: { type: String, default: '' },
      landmark: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

// Sync fields before save for backward compatibility
incidentSchema.pre('save', function (next) {
  if (this.reporter && !this.reporterId) {
    this.reporterId = this.reporter;
  } else if (this.reporterId && !this.reporter) {
    this.reporter = this.reporterId;
  }

  if (this.evidencePhotos && this.evidencePhotos.length > 0 && (!this.imageUrls || this.imageUrls.length === 0)) {
    this.imageUrls = this.evidencePhotos;
  } else if (this.imageUrls && this.imageUrls.length > 0 && (!this.evidencePhotos || this.evidencePhotos.length === 0)) {
    this.evidencePhotos = this.imageUrls;
  }

  if (this.roomCode && (!this.location || !this.location.roomArea)) {
    this.location = this.location || {};
    this.location.campus = this.campus;
    this.location.roomArea = this.roomCode;
  } else if (this.location && this.location.roomArea && !this.roomCode) {
    this.roomCode = this.location.roomArea;
    this.campus = this.location.campus || this.campus;
  }

  next();
});

/* ═══════════════════════════════════════════════════════════
   INDEXES — Optimise frequent queries
   ═══════════════════════════════════════════════════════════ */
incidentSchema.index({ ticketId: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ campus: 1 });
incidentSchema.index({ category: 1 });
incidentSchema.index({ reporter: 1 });
incidentSchema.index({ reporterId: 1 });
incidentSchema.index({ createdAt: -1 });

/* ═══════════════════════════════════════════════════════════
   MODEL EXPORTS
   ═══════════════════════════════════════════════════════════ */
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Incident = mongoose.models.Incident || mongoose.model('Incident', incidentSchema);
const Report = Incident; // Alias Report to Incident for seamless backwards compatibility

module.exports = { User, Incident, Report };
