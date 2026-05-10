const express = require('express');
const bodyParser = require('body-parser');

// Routes Here
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

app.get('/', function(req, res) {
    res.send("Sanota");
});

// Endpoint Here
app.use('/api/user', authRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
