require('dotenv').config()
const express = require('express');
const connectToDB = require('./database/db')
const authRoutes = require('./routes/auth-routes')
const homeRoutes = require('./routes/home-route')
const adminRoutes = require('./routes/admin-routes');    
const uploadImageRoutes = require('./routes/image-routes');

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/image', uploadImageRoutes)

// Connect to database before starting server
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
})

