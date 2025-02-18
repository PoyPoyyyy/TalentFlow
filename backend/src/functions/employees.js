const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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
            SELECT
                e.id,
                e.first_name,
                e.last_name,
                e.hire_date,
                encode(e.profile_picture, 'base64') AS profile_picture,
                json_agg(json_build_object('code', s.code, 'description', s.description)) AS skills
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
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/employees', upload.single('profilePicture'), async (req, res) => {
    const { firstName, lastName, hireDate, skills } = req.body;
    const profilePicture = req.file ? req.file.buffer : null;

    if (!firstName || !lastName || !hireDate || !skills) {
        return res.status(400).json({ message: 'Données invalides.' });
    }

    let parsedSkills = [];
    try {
        parsedSkills = JSON.parse(skills);
        if (!Array.isArray(parsedSkills)) throw new Error('Skills doit être un tableau');
    } catch (error) {
        return res.status(400).json({ message: 'Les compétences sont mal formatées.' });
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO EMPLOYEE (first_name, last_name, hire_date, profile_picture) VALUES ($1, $2, $3, $4) RETURNING id',
            [firstName, lastName, hireDate, profilePicture]
        );
        const employeeId = result.rows[0].id;

        for (const skill of parsedSkills) {
            await client.query(
                'INSERT INTO EMPLOYEE_SKILL (employee_id, skill_code) VALUES ($1, $2)',
                [employeeId, skill]
            );
        }

        client.release();
        res.status(201).json({ message: 'Employé créé avec succès', employeeId });
    } catch (err) {
        console.error(err);
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
        res.status(200).json({ message: 'Employé supprimé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


router.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, hireDate, skills } = req.body;

    if (!firstName || !lastName || !hireDate || !skills) {
        return res.status(400).json({ message: 'Données invalides.' });
    }

    let parsedSkills;
    try {
        parsedSkills = JSON.parse(skills);
        if (!Array.isArray(parsedSkills)) throw new Error('Skills doit être un tableau');
    } catch (error) {
        return res.status(400).json({ message: 'Les compétences sont mal formatées.' });
    }

    try {
        const client = await pool.connect();
        await client.query(
            'UPDATE EMPLOYEE SET first_name = $1, last_name = $2, hire_date = $3 WHERE id = $4',
            [firstName, lastName, hireDate, id]
        );

        await client.query('DELETE FROM EMPLOYEE_SKILL WHERE employee_id = $1', [id]);
        for (const skill of parsedSkills) {
            await client.query(
                'INSERT INTO EMPLOYEE_SKILL (employee_id, skill_code) VALUES ($1, $2)',
                [id, skill]
            );
        }

        client.release();
        res.status(200).json({ message: 'Employé mis à jour avec succès' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/employees/:id', async (req, res) => {
    const employeeId = req.params.id;
    try {
        const client = await pool.connect();
        const query = `
      SELECT
        e.id,
        e.first_name,
        e.last_name,
        e.hire_date,
        json_agg(json_build_object('code', s.code, 'description', s.description)) AS skills
      FROM EMPLOYEE e
      LEFT JOIN EMPLOYEE_SKILL es ON e.id = es.employee_id
      LEFT JOIN SKILL s ON es.skill_code = s.code
      WHERE e.id = $1
      GROUP BY e.id
    `;
        const result = await client.query(query, [employeeId]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Employé non trouvé');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});


module.exports = router;
