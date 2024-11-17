const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authRoutes = require('./routes/authRoutes');
const audienceRoutes = require('./routes/customer');

const app = express();


app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}));

app.use(express.json());


app.use(session({
    secret: '92fc674065e2f0ac4dd582b888364352800f5343a52f5993f736db1ee62c94fc1d7fc0a7b8c28eebfa6130a7b06496802d3f0064d80e51fdcacb56ee6502427b',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://manojbhaskarmvs2021:qPbo5rS3oRRweiwe@xenobackend.ld71e.mongodb.net/?retryWrites=true&w=majority&appName=xenoBackend'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 3600000
    }
}));


mongoose.connect('mongodb+srv://manojbhaskarmvs2021:qPbo5rS3oRRweiwe@xenobackend.ld71e.mongodb.net/?retryWrites=true&w=majority&appName=xenoBackend', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => console.log('MongoDB connected successfully.'));
mongoose.connection.on('error', (err) => console.log('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected.'));



app.use('/api/auth', authRoutes);
app.use('/api/audience', audienceRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
