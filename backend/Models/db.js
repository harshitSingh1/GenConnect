// backend\Models\db.js
const mongoose = require('mongoose');
const mongo_url = process.env.MONGODB_URI;
mongoose.connect(mongo_url)
.then(() => {
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log('MongoDB connection error:', err);
})

