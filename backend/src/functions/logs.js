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

/*
* Récupère la liste des logs paginée.
* @input : page (number), limit (number)
* @output : logs (array) - La liste des logs
*/
router.get('/logs', (req, res) => {
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
/*
* Ajoute un nouveau log
* @input : user_id, title, content
* @output : log (object) - Le log créé
*/
router.post('/logs', (req, res) => {
    const { user_id, title, content } = req.body;
    if (!user_id || !title || !content) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const query = `
        INSERT INTO LOGS (user_id, title, content, date) 
        VALUES ($1, $2, $3, LOCALTIMESTAMP);
    `;
    pool.query(query, [user_id, title, content])
        .then((result) => res.status(201).json(result.rows[0]))
        .catch((err) => res.status(500).json({ error: err.message }));
});

/*
* Récupère le nombre total de logs
* @input : aucun
* @output : total (number) - Le nombre total de logs
*/
router.get('/logs/count', (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM LOGS';
    pool.query(query)
        .then((result) => res.json(result.rows[0]))
        .catch((err) => res.status(500).json({ error: err.message }));
});

/*
* Récupère la liste des logs
* @input : aucun
* @output : logs (array) - La liste des logs
*/
router.get('/logs', (req, res) => {
    const query = 'SELECT * FROM LOGS ORDER BY date DESC';
    pool.query(query)
        .then((result) => res.json(result.rows))
        .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
