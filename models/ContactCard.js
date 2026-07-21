const mongoose = require('mongoose');

const contactCardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  icon: { type: String, default: 'MapPin' },
  lines: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.ContactCard || mongoose.model('ContactCard', contactCardSchema);
