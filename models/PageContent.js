const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
  text: { type: String, default: '' },
  url: { type: String, default: '#' },
  style: { type: String, enum: ['primary', 'outline', 'dark'], default: 'primary' },
  openNewTab: { type: Boolean, default: false },
}, { _id: true });

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { _id: true });

const sectionSchema = new mongoose.Schema({
  sectionKey: { type: String, required: true },
  sectionLabel: { type: String, default: '' },
  miniTitle: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  paragraph: { type: String, default: '' },
  paragraph2: { type: String, default: '' },
  images: [imageSchema],
  buttons: [buttonSchema],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  extra: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: true, timestamps: true });

const pageContentSchema = new mongoose.Schema({
  pageKey: { type: String, required: true, unique: true },
  pageLabel: { type: String, default: '' },
  sections: [sectionSchema],
  isActive: { type: Boolean, default: true },
  lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.models.PageContent || mongoose.model('PageContent', pageContentSchema);
