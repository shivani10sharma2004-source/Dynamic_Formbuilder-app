const express = require('express');
const router = express.Router();
const Form = require('../models/form');

// POST: Form Save/Publish karne ke liye
// POST: Form Save/Publish karne ke liye
router.post('/save', async (req, res) => {
  try {
    // Yahan req.body me 'userEmail' add kiya hai
    const { formId, userEmail, name, description, theme, active, status, fields } = req.body; 
    
    let form = await Form.findOne({ formId });
    if (form) {
      form = await Form.findOneAndUpdate({ formId }, req.body, { new: true });
    } else {
      // Yahan Form banate waqt 'userEmail' pass kiya hai
      form = new Form({ formId, userEmail, name, description, theme, active, status, fields });
      await form.save();
    }
    
    res.status(200).json({ message: 'Form saved successfully!', form });
  } catch (error) {
    console.error("Form Save Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET: Link open karne par Form ka data laane ke liye
router.get('/:formId', async (req, res) => {
  try {
    const form = await Form.findOne({ formId: req.params.formId });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;