const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const bcrypt = require('bcrypt');
const fs = require('fs');
const xml2js = require('xml2js');

// DB connection
const connection = require('./db_connect');

const app = express();
const PORT = 8084;

// Middleware to parse incoming JSON data
app.use(express.json());

// Corse protection

const allowedOrigins = ['http://localhost:8083'];

app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
}));

// Security Middleware 

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "http://localhost:8083"],
          imgSrc: ["'self'", "http://localhost:8083"],
          styleSrc: ["'self'", "'unsafe-inline'", "http://localhost:8083"],
          connectSrc: ["'self'", "http://localhost:8083"],
        },
      },
    })
);

// Request 


app.get('/donnees', (req, res) => {
  // Lire le fichier XML
  fs.readFile('./base.xml', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Une erreur s\'est produite lors de la lecture du fichier XML.');
      return;
    }

    // Convertir le XML en objet JavaScript
    xml2js.parseString(data, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Une erreur s\'est produite lors de la conversion du XML en objet JavaScript.');
        return;
      }

      // Récupérer toutes les données
      const biens = result.biens.bien.map(bien => {
        const images = Object.keys(bien.images[0]).map(key => bien.images[0][key]);
        return {
          ville: bien.ville[0],
          type: bien.type_bien[0],
          prix: bien.prix[0],
          images: images,
          // Ajoutez ici les autres données que vous souhaitez récupérer
        };
      });

      // Envoyer les données en tant que réponse JSON
      res.json(biens);
    });
  });
});


// Post data, free estimation *send the data in a tables.
app.post('/estimationGratuite', (req, res) => {
  const { form1, form2 } = req.body;

  // Process the received data
  console.log('Form 1 data:', form1);
  console.log('Form 2 data:', form2);

  // Send a response back to the client
  res.json({ message: 'Data received successfully' });
});

// Get reviews
app.get('/reviews', (req, res) => {
  getAllReviews((err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    } else {
      res.json(results);
    }
  });
});

app.post('/connexion', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error checking user:', error);
      res.status(500).send('An error occurred while checking the user');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('Invalid email');
      return;
    }

    const user = results[0];

    // Compare the hashed password with the provided password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).send('An error occurred while checking the password');
        return;
      }

      if (!isMatch) {
        res.status(401).send('Invalid password');
        return;
      }

      res.send('User successfully logged in');
    });
  });
});

// Port Server 
app.listen(PORT, () => {
  console.log(`Proxy server is running at http://localhost:${PORT}`);
});
