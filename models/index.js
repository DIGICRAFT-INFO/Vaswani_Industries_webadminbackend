const mongoose = require('mongoose');
const slugify = require('slugify');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  category: { type: String, enum: ['Industrial', 'Factory', 'Business', 'Finance', 'CSR', 'Other'], default: 'Industrial' },
  image: { type: String, default: '' },
  tags: [{ type: String }],
  author: { type: String, default: 'Vaswani Industries' },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

newsSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = slugify(this.title + '-' + Date.now(), { lower: true, strict: true });
  }
  next();
});

const boardMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true },
  type: { type: String, enum: ['WHOLE TIME DIRECTOR', 'NON-EXECUTIVE DIRECTOR', 'INDEPENDENT DIRECTOR', 'EXECUTIVE DIRECTOR', 'CHAIRMAN', 'ADDITIONAL WOMAN DIRECTOR'], default: 'INDEPENDENT DIRECTOR' },
  image: { type: String, default: '' },
  bio: { type: String, default: '' },
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  committees: [{ name: String, role: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  department: { type: String, default: '' },
  location: { type: String, default: 'Raipur, Chhattisgarh' },
  experience: { type: String, required: true },
  qualification: { type: String, default: '' },
  description: { type: String, default: '' },
  responsibilities: [{ type: String }],
  skills: [{ type: String }],
  salary: { type: String, default: '' },
  lastDate: { type: Date },
  isActive: { type: Boolean, default: true },
  applications: [{
    name: String, email: String, phone: String,
    resumeUrl: String, coverLetter: String, appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' }
  }],
}, { timestamps: true });


const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  repliedAt: { type: Date },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, enum: ['FORGING INGOTS & BILLETS', 'SPONGE IRON', 'POWER', 'TMT BARS', 'CASTING'] },
  badge: { type: String, default: '' },
  specifications: [[{ type: String }]],
  specHeaders: [{ type: String }],
  reactions: [{ left: String, right: String }],
  reactionsTitle: { type: String, default: 'BASIC REDUCTION REACTIONS:' },
  quickFact: { type: String, default: '' },
  pdfCatalogUrl: { type: String, default: '' },
  images: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Vaswani Industries Ltd.' },
  phone: { type: String, default: '+91 7713540221' },
  email: { type: String, default: 'hrd@vaswaniindustries.com' },
  address: { type: String, default: 'Raipur, Chhattisgarh, India' },
  facebook: { type: String, default: '#' },
  twitter: { type: String, default: '#' },
  linkedin: { type: String, default: '#' },
  heroBannerTitle: { type: String, default: 'Integrated Steel Manufacturer in India with Captive Power & Solar Energy' },
  heroBannerSubtext: { type: String, default: 'Vaswani Industries Limited is a leading integrated steel manufacturing company in India.' },
  aboutTitle: { type: String, default: 'Leading Integrated Steel Manufacturer in Central India' },
  aboutText: { type: String, default: 'Vaswani Industries Limited is a publicly listed integrated steel manufacturing company headquartered in Central India.' },
  sisterConcern: { type: String, default: 'Kwality Foundry Industries' },
  sisterConcernUrl: { type: String, default: '#' },
  vision: { type: String, default: '' },
  mission: { type: String, default: '' },
}, { timestamps: true });

module.exports = {
  News: mongoose.models.News || mongoose.model('News', newsSchema),
  BoardMember: mongoose.models.BoardMember || mongoose.model('BoardMember', boardMemberSchema),
  Career: mongoose.models.Career || mongoose.model('Career', careerSchema),
  Contact: mongoose.models.Contact || mongoose.model('Contact', contactSchema),
  Product: mongoose.models.Product || mongoose.model('Product', productSchema),
  Settings: mongoose.models.Settings || mongoose.model('Settings', settingsSchema),
};
