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
        const query = 
            `SELECT 
    m.id, 
    m.name, 
    m.description, 
    m.start_date, 
    m.duration, 
    m.status,

    -- Récupération unique des skills
    (SELECT json_agg(json_build_object(
        'code', sub_s.code,
        'description', sub_s.description,
        'quantity', sub_s.quantity
    ))
    FROM (
        SELECT DISTINCT s.code, s.description, ms.quantity
        FROM MISSION_SKILL ms
        LEFT JOIN SKILL s ON ms.skill_code = s.code
        WHERE ms.mission_id = m.id
    ) AS sub_s) AS skills,

    -- Récupération unique des employés
    (SELECT json_agg(json_build_object(
        'id', sub_e.id,
        'first_name', sub_e.first_name,
        'last_name', sub_e.last_name,
        'hire_date', sub_e.hire_date
    ))
    FROM (
        SELECT DISTINCT e.id, e.first_name, e.last_name, e.hire_date
        FROM MISSION_EMPLOYEE me
        LEFT JOIN EMPLOYEE e ON me.employee_id = e.id
        WHERE me.mission_id = m.id
    ) AS sub_e) AS employees

FROM MISSION m;



        `;

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

    if (!name || !description || !start_date || !duration || !status || !skills) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    try {
        const client = await pool.connect();
        
        // Insérer la mission
        const result = await client.query(
            'INSERT INTO MISSION (name, description, start_date, duration, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, description, start_date, duration, status]
        );
        const missionId = result.rows[0].id;

        // Insérer les compétences requises
        for (const skill of skills) {
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
        
        // Supprimer d'abord les relations dans les tables associatives
        await client.query('DELETE FROM MISSION_SKILL WHERE mission_id = $1', [missionId]);
        await client.query('DELETE FROM MISSION_EMPLOYEE WHERE mission_id = $1', [missionId]);
        
        // Supprimer ensuite la mission
        await client.query('DELETE FROM MISSION WHERE id = $1', [missionId]);
        
        client.release();
        res.status(200).send('Mission supprimée avec succès');
    } catch (err) {
        console.error('Erreur lors de la suppression de la mission:', err);
        res.status(500).send('Erreur serveur');
    }
});


router.put('/missions/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, start_date, duration, status, skills, employees } = req.body;

    if (!name || !description || !start_date || !duration || !status || !skills || !employees) {
        return res.status(400).json({ message: 'Données invalides.' });
    }

    try {
        const client = await pool.connect();
        
        // Mise à jour des informations de la mission
        await client.query(
            'UPDATE MISSION SET name = $1, description = $2, start_date = $3, duration = $4, status = $5 WHERE id = $6',
            [name, description, start_date, duration, status, id]
        );

        // Vérification si des compétences et employés existent déjà pour cette mission
        if (skills.length > 0) {
            // Supprimer les anciennes compétences avant d'ajouter les nouvelles
            await client.query('DELETE FROM MISSION_SKILL WHERE mission_id = $1', [id]);


            for (const skill of skills) {
                const skillCode = skill.skill ? skill.skill.code : skill.code; // Gérer les deux formats possibles
                await client.query(
                    'INSERT INTO MISSION_SKILL (mission_id, skill_code, quantity) VALUES ($1, $2, $3)',
                    [id, skillCode, skill.quantity]
                );
            }
        }

        if (employees.length > 0) {
            // Supprimer les anciens employés avant d'ajouter les nouveaux
            await client.query('DELETE FROM MISSION_EMPLOYEE WHERE mission_id = $1', [id]);

            // Ajouter les nouveaux employés
            for (const employee of employees) {
                await client.query(
                    'INSERT INTO MISSION_EMPLOYEE (mission_id, employee_id) VALUES ($1, $2)',
                    [id, employee.id]
                );
            }
        }

        client.release();
        res.status(200).json({ message: 'Mission mise à jour avec succès' });

    } catch (err) {
        console.error('Erreur lors de la mise à jour de la mission:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});




router.get('/missions/:id', async (req, res) => {
    const missionId = req.params.id;
    try {
        const client = await pool.connect();
        const query = `
            SELECT 
                m.id, 
                m.name, 
                m.description, 
                m.start_date, 
                m.duration, 
                m.status,

                json_agg( json_build_object(
                    'code', s.code,
                    'description', s.description,
                    'quantity', ms.quantity
                )) AS skills,

                json_agg( json_build_object(
                    'id', e.id,
                    'first_name', e.first_name,
                    'last_name', e.last_name,
                    'hire_date', e.hire_date
                )) AS employees

            FROM MISSION m
            LEFT JOIN MISSION_SKILL ms ON m.id = ms.mission_id
            LEFT JOIN SKILL s ON ms.skill_code = s.code
            LEFT JOIN MISSION_EMPLOYEE me ON m.id = me.mission_id
            LEFT JOIN EMPLOYEE e ON me.employee_id = e.id

            WHERE m.id = $1
            GROUP BY m.id;
        `;
        
        const result = await client.query(query, [missionId]);
        client.release();
        
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Mission non trouvée');
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la mission:', err);
        res.status(500).send('Erreur serveur');
    }
});



module.exports = router;