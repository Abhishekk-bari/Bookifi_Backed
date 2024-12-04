const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// mongodb
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Define schema
const FormSchema = new mongoose.Schema({
    name: String,
    number: Number,
    email: String,
    message: String,
}, { collection: "forms" });

const FormModel = mongoose.model('Form', FormSchema);

// POST: Save form data
app.post('/submit-form', async (req, res) => {
    try {
        const formData = new FormModel(req.body);
        await formData.save();
        res.status(201).json({ message: 'Form data saved successfully!' });
    } catch (err) {
        console.error('Error saving form data:', err);
        res.status(500).json({ error: 'Error saving form data' });
    }
});

// GET: Fetch booking data
app.get('/api/bookings', async (req, res) => {
    try {
        const searchTerm = req.query.name || '';
        const bookings = await FormModel.find({
            name: { $regex: searchTerm, $options: 'i' }
        });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// DELETE: Delete form data by ID
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBooking = await FormModel.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error('Error deleting booking:', err);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

// PUT: Update form data by ID
app.put('/api/bookings/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const updatedBooking = await FormModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking updated successfully', data: updatedBooking });
    } catch (err) {
        console.error('Error updating booking:', err);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
