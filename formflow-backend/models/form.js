const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  formId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true }, // <--- BAS YEH EK NAYI LINE ADD KARIYE
  name: { type: String, required: true },
  description: { type: String },
  theme: { type: String, default: 'indigo' },
  active: { type: Boolean, default: true },
  status: { type: String, default: 'Draft' },
  fields: { type: Array, required: true },
  responsesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', FormSchema);