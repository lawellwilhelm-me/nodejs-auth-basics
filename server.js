require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db');
const userRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/image-routes');


const app = express();

app.use(express.json());

connectToDB();

app.use('/api/auth', userRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/images', uploadImageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})