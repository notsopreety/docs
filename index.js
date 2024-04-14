const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Serve index.html
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve docs.html
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs.html'));
});

// Serve about.html
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

// Serve all files in the public directory
app.use(express.static(path.join(__dirname)));

// Catch-all route to access any file through URL
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});