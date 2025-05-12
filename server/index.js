const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth.js');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "https://relaxfocusite.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }))
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Підключено до MongoDB'))
.catch((err) => console.error('❌ Помилка підключення до MongoDB:', err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Сервер працює!');
});
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на порту ${PORT}`);
});
