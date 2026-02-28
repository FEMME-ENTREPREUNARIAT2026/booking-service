const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'booking-service fonctionne !' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`booking-service actif sur le port ${PORT}`);
});