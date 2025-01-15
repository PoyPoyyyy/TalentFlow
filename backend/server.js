const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Configuration de la base PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db',
    password: 'dbtalentflow',
    port: 5432, // Port PostgreSQL par défaut
});

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Test de connexion à PostgreSQL
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connecté à PostgreSQL');
    }
});

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


