const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public'))); // your HTML/CSS/JS go in 'public' folder

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
