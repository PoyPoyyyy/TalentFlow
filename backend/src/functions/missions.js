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
            SELECT m.id, m.name, m.description, m.start_date, m.duration, m.status
            FROM MISSION m;
            `;
            // ,json_agg(json_build_object('code', s.code, 'description', s.description)) AS skills || , MISSION_SKILL ms, SKILL s WHERE m.id = ms.mission_id AND ms.skill_code = s.code
        const result = await client.query(query);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des missions:', err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/missions', async (req, res) => {
    const { name, description, start_date, duration, status } = req.body;

    if (!name || !description || !start_date || !duration || !status ) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO MISSION (name, description, start_date, duration, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, description, start_date, duration, status]
        );
        const missionId = result.rows[0].id;

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
        //await client.query('DELETE FROM MISSION_SKILL WHERE mission_id = $1', [missionId]);
        await client.query('DELETE FROM MISSION WHERE id = $1', [missionId]);
        client.release();
        res.status(200).send('Mission supprimée avec succès');
    } catch (err) {
        console.error('Erreur lors de la suppression de la mission:', err);
        res.status(500).send('Erreur serveur');
    }
});


module.exports = router;

