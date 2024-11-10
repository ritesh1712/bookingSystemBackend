const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const updateProfile = require('./routes/upDateProfile')
const slot = require('./routes/slot')
const getSlot = require('./routes/getSlot')
const getUser = require('./routes/getUser')
const cors = require('cors')


dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/api/user/auth', authRoutes);
app.use('/api/user', updateProfile);
app.use('/api/user', getUser);
app.use('/api/slot', slot);
app.use('/api/slot', getSlot);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
