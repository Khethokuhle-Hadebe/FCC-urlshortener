require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns')

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [];
let counter = 1;

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  try {
    const urlObj = new URL(originalUrl);

    dns.lookup(urlObj.hostname, (err) => {
      if (err) return res.json({ error: "invalid url" });

      const shortUrl = urls.length + 1;
      urls.push({ original_url: originalUrl, short_url: shortUrl });

      res.json({ original_url: originalUrl, short_url: shortUrl });
    });
  } catch (e) {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const found = urls.find((entry) => entry.short_url === id);

  if (found) {
    res.redirect(found.original_url);
  } else {
    res.json({ error: "No short URL found" });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
