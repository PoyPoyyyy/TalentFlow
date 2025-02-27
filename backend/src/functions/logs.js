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

app.get('/api/logs', (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const query = `
        SELECT * FROM LOGS
        ORDER BY date DESC
        LIMIT $1 OFFSET $2
    `;
    pool.query(query, [limit, offset])
        .then((result) => res.json(result.rows))
        .catch((err) => res.status(500).json({ error: err.message }));
});

app.get('/api/logs/count', (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM LOGS';
    pool.query(query)
        .then((result) => res.json(result.rows[0]))
        .catch((err) => res.status(500).json({ error: err.message }));
});

app.get('/logs', (req, res) => {
    const query = 'SELECT * FROM LOGS ORDER BY date DESC';
    pool.query(query)
        .then((result) => res.json(result.rows))
        .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
