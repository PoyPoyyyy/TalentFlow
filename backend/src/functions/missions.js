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
 * Récupère la liste complète des missions.
 * @input : aucun
 * @output : Observable<Mission[]> - La liste des missions sous forme d'un tableau d'objets Mission.
 */
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
		'skill', json_build_object(
			'code', sub_s.code,
        	'description', sub_s.description
		),
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


/*
 * Ajoute une nouvelle mission.
 * @input : name, description, start_date, duration, status, skills (JSON Array)
 * @output : number - ID de la mission créée.
 */
router.post('/missions', async (req, res) => {
    const { name, description, start_date, duration, status, skills } = req.body;

    if (!name || !description || !start_date || !duration || !status || !skills) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    try {
        const client = await pool.connect();
        
        const result = await client.query(
            'INSERT INTO MISSION (name, description, start_date, duration, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, description, start_date, duration, status]
        );
        const missionId = result.rows[0].id;

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

/*
 * Récupère les infos des missions liées à un employé spécifique.
 * @input : employee - ID de l'employé
 * @output : Mission[] - liste des missions.
 */
router.get('/employees/:id/missions', async (req, res) => {
    const employeeId = req.params.id;
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
                (SELECT json_agg(json_build_object(
                    'skill', json_build_object(
                        'code', s.code,
                        'description', s.description
                    ),
                    'quantity', ms.quantity
                ))
                FROM MISSION_SKILL ms
                LEFT JOIN SKILL s ON ms.skill_code = s.code
                WHERE ms.mission_id = m.id
                ) AS skills,
                (SELECT json_agg(json_build_object(
                    'id', e.id,
                    'first_name', e.first_name,
                    'last_name', e.last_name,
                    'hire_date', e.hire_date
                ))
                FROM MISSION_EMPLOYEE me
                LEFT JOIN EMPLOYEE e ON me.employee_id = e.id
                WHERE me.mission_id = m.id
                ) AS employees
            FROM MISSION m
            JOIN MISSION_EMPLOYEE me ON m.id = me.mission_id
            WHERE me.employee_id = $1;
        `;
        const result = await client.query(query, [employeeId]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des missions pour employé:', err);
        res.status(500).send('Erreur serveur');
    }
});

/*
 * Supprime une mission ainsi que ses compétences et employés associés.
 * @input : number - ID de la mission.
 * @output : string - Message de confirmation.
 */
router.delete('/missions/:id', async (req, res) => {
    const missionId = req.params.id;
    try {
        const client = await pool.connect();
        
        await client.query('DELETE FROM MISSION_SKILL WHERE mission_id = $1', [missionId]);
        await client.query('DELETE FROM MISSION_EMPLOYEE WHERE mission_id = $1', [missionId]);
        
        await client.query('DELETE FROM MISSION WHERE id = $1', [missionId]);
        
        client.release();
        res.status(200).send('Mission supprimée avec succès');
    } catch (err) {
        console.error('Erreur lors de la suppression de la mission:', err);
        res.status(500).send('Erreur serveur');
    }
});

/*
 * Met à jour les informations d'une mission ainsi que ses compétences.
 * @input : number - ID de la mission.
 * @output : string - Message de confirmation.
 */
router.put('/missions/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, start_date, duration, status, skills, employees } = req.body;

    if (!name || !description || !start_date || !duration || !status || !skills || !employees) {
        return res.status(400).json({ message: 'Données invalides.' });
    }

    try {
        const client = await pool.connect();
        
        await client.query(
            'UPDATE MISSION SET name = $1, description = $2, start_date = $3, duration = $4, status = $5 WHERE id = $6',
            [name, description, start_date, duration, status, id]
        );

        if (skills.length > 0) {
            await client.query('DELETE FROM MISSION_SKILL WHERE mission_id = $1', [id]);


            for (const skill of skills) {
                await client.query(
                    'INSERT INTO MISSION_SKILL (mission_id, skill_code, quantity) VALUES ($1, $2, $3)',
                    [id, skill.skill.code, skill.quantity]
                );
            }
        }

        if (employees.length > 0) {
            await client.query('DELETE FROM MISSION_EMPLOYEE WHERE mission_id = $1', [id]);

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

/*
 * Récupère les infos d'une mission spécifique avec ses compétences requises et les employés affectés à celle-ci.
 * @input : number - ID de la mission
 * @output : Mission - Objet Mission sous la forme (id, name, description, start_date, duration, status, skills (JSON Array), employees(JSON Array)).
 */
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

    -- Récupération unique des skills
    (SELECT json_agg(json_build_object(
		'skill', json_build_object(
			'code', sub_s.code,
        	'description', sub_s.description
		),
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

FROM MISSION m

            WHERE m.id = $1;
            
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