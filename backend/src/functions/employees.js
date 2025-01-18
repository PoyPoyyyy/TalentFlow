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

router.get('/employees', async (req, res) => {
    try {
        const client = await pool.connect();
        const query = `
            SELECT e.id, e.first_name, e.last_name, e.hire_date, json_agg(json_build_object('code', s.code, 'description', s.description)) AS skills
            FROM EMPLOYEE e, EMPLOYEE_SKILL es, SKILL s
            WHERE e.id = es.employee_id
            AND es.skill_code = s.code
            GROUP BY e.id;
            `;
        const result = await client.query(query);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des employés et de leurs compétences:', err);  // Corrigé ici
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
