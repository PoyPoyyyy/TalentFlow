const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db',
    password: 'dbtalentflow',
    port: 5432,
});

router.get('/skills', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM SKILL');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des compétences:', err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
