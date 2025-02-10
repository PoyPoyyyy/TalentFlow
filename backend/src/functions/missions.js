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

router.get('/missions', async (req, res) => {
    try {
        const client = await pool.connect();
        const query = `
            SELECT m.id, m.name, m.description, m.start_date, m.duration, m.status,
            json_agg(json_build_object('code', s.code, 'description', s.description, 'quantity', ms.quantity)) AS skills
            FROM MISSION m, MISSION_SKILL ms, SKILL s
            WHERE m.id = ms.mission_id 
            AND ms.skill_code = s.code
            GROUP BY m.id;
            `;
<<<<<<< Updated upstream
            // ,json_agg(json_build_object('code', s.code, 'description', s.description)) AS skills || , MISSION_SKILL ms, SKILL s WHERE m.id = ms.mission_id AND ms.skill_code = s.code
=======
>>>>>>> Stashed changes
        const result = await client.query(query);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des missions:', err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/missions', async (req, res) => {
    const { name, description, start_date, duration, status, skills } = req.body;

    if (!name || !description || !start_date || !duration || !status || !skills ) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    let parsedSkills = [];
    if (Array.isArray(skills)) {
        parsedSkills = skills;
    } else {
        try {
            parsedSkills = JSON.parse(skills);
            if (!Array.isArray(parsedSkills)) throw new Error('Skills doit être un tableau');
        } catch (error) {
            return res.status(400).json({ message: 'Les compétences sont mal formatées.' });
        }
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO MISSION (name, description, start_date, duration, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, description, start_date, duration, status]
        );
        const missionId = result.rows[0].id;

        for (const skill of parsedSkills) {
            await client.query(
                'INSERT INTO MISSION_SKILL (mission_id, skill_code, quantity) VALUES ($1, $2, $3)',
                [missionId, skill.skill.code, skill.quantity]
            );
        }

        client.release();
        res.status(201).json({ message: 'Mission créée avec succès', missionId });

    } catch (err) {
        console.error('Erreur lors de l\'ajout de la mission :', err);
        res.status(500).send('Erreur serveur');
    }
});


router.delete('/missions/:id', async (req, res) => {
    const missionId = req.params.id;
    try {
        const client = await pool.connect();
        await client.query('DELETE FROM MISSION_SKILL WHERE mission_id = $1', [missionId]);
        await client.query('DELETE FROM MISSION WHERE id = $1', [missionId]);
        client.release();
        res.status(200).send('Mission supprimée avec succès');
    } catch (err) {
        console.error('Erreur lors de la suppression de la mission:', err);
        res.status(500).send('Erreur serveur');
    }
});


module.exports = router;

