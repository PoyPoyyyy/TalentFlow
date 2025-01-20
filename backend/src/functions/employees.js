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
            GROUP BY e.id
            ORDER BY e.last_name;
            `;
        const result = await client.query(query);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des employés et de leurs compétences:', err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/employees', async (req, res) => {
    const { firstName, lastName, hireDate, skills } = req.body;
    if (!firstName || !lastName || !hireDate || !Array.isArray(skills)) {
        return res.status(400).json({ message: 'Données invalides' });
    }
    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO EMPLOYEE (first_name, last_name, hire_date) VALUES ($1, $2, $3) RETURNING id',
            [firstName, lastName, hireDate]
        );
        const employeeId = result.rows[0].id;
        for (const skill of skills) {
            await client.query(
                'INSERT INTO EMPLOYEE_SKILL (employee_id, skill_code) VALUES ($1, $2)',
                [employeeId, skill]
            );
        }
        client.release();
        res.status(201).json({ message: 'Employé créé avec succès', employeeId });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de l\'employé:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.delete('/employees/:id', async (req, res) => {
    const employeeId = req.params.id;
    try {
        const client = await pool.connect();
        await client.query('DELETE FROM EMPLOYEE_SKILL WHERE employee_id = $1', [employeeId]);
        await client.query('DELETE FROM EMPLOYEE WHERE id = $1', [employeeId]);
        client.release();
        res.status(200).send('Employé supprimé avec succès');
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'employé:', err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
