const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// All available sidebar permissions
const ALL_PERMISSIONS = [
  'overview', 'pages', 'documents', 'news',
  'board-members', 'careers', 'contact-cards',
  'contacts', 'notifications', 'settings',
];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  // Granular permissions — superadmin always has all, admin gets what superadmin grants
  permissions: {
    type: [{ type: String, enum: ALL_PERMISSIONS }],
    default: ['overview'],
  },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual: superadmin always has all permissions
userSchema.methods.getPermissions = function() {
  if (this.role === 'superadmin') return ALL_PERMISSIONS;
  return this.permissions || ['overview'];
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
module.exports.ALL_PERMISSIONS = ALL_PERMISSIONS;
