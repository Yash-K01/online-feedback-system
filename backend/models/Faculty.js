const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// NOTE: password is added (beyond the assignment's two fields) because
// the brief requires a Faculty login.
const facultySchema = new mongoose.Schema(
  {
    facultyId: { type: String, required: true, unique: true, trim: true },
    facultyName: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  { timestamps: true }
);

facultySchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

facultySchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Faculty', facultySchema);
