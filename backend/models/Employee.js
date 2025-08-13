const mongoose = require("mongoose");

const allowedPositions = [
  "Intern",
  "Junior Developer",
  "Developer",
  "Senior Developer",
  "Designer",
  "HR",
  "Manager",
  "Director"
];

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/,
        "Email must be @gmail.com or @outlook.com"
      ],
      unique: true
    },
    position: {
      type: String,
      enum: allowedPositions,
      required: true,
      set: v => (typeof v === "string" ? v.trim() : v)
    }
  },
  { timestamps: true }
);

// Optional explicit index to ensure uniqueness at DB level
employeeSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Employee", employeeSchema);
module.exports.allowedPositions = allowedPositions;
