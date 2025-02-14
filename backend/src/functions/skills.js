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
        const result = await client.query('SELECT * FROM SKILL ORDER BY code');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des compétences:', err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/skills', async (req, res) => {
    const { category, description } = req.body;

    if (!category || !description) {
        return res.status(400).json({ message: "Catégorie et description requises." });
    }

    try {
        const client = await pool.connect();

        // Trouver le premier numéro disponible dans la catégorie choisie
        const result = await client.query(
            `SELECT code FROM SKILL WHERE code LIKE $1 ORDER BY code`,
            [`${category}.%`]
        );

        let nextNumber = 1;
        const existingCodes = result.rows.map(row => parseInt(row.code.split('.')[1])).sort((a, b) => a - b);

        for (const num of existingCodes) {
            if (num === nextNumber) {
                nextNumber++;
            } else {
                break;
            }
        }

        const newCode = `${category}.${nextNumber}`;

        // Insérer le nouveau skill
        const insertResult = await client.query(
            'INSERT INTO SKILL (code, description) VALUES ($1, $2) RETURNING *',
            [newCode, description]
        );

        client.release();
        res.status(201).json({ message: "Skill ajouté avec succès.", skill: insertResult.rows[0] });
    } catch (err) {
        console.error("Erreur lors de l’ajout du skill :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
});


router.delete('/skills/:code', async (req, res) => {
    const skillCode = req.params.code;

    try {
        const client = await pool.connect();

        // Supprime d'abord les références dans EMPLOYEE_SKILL
        await client.query('DELETE FROM EMPLOYEE_SKILL WHERE skill_code = $1', [skillCode]);

        // Puis supprime la compétence elle-même
        const result = await client.query('DELETE FROM SKILL WHERE code = $1', [skillCode]);

        client.release();

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Compétence non trouvée' });
        }

        res.status(200).json({ message: 'Compétence supprimée avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la compétence:', err);
        res.status(500).send('Erreur serveur');
    }
});


router.put('/skills/:code', async (req, res) => {
    const { code } = req.params;
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ message: "La description est requise." });
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            'UPDATE SKILL SET description = $1 WHERE code = $2 RETURNING *',
            [description, code]
        );
        client.release();

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Compétence non trouvée." });
        }

        res.status(200).json({ message: "Compétence mise à jour avec succès.", skill: result.rows[0] });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la compétence :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// à vérifier
router.get('/skills/:code', async (req, res) => {
    const skillCode = req.params.code;
    console.log(`Requête reçue pour le code de compétence : ${skillCode}`);  // Log pour voir le code récupéré
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM SKILL WHERE code = $1', [skillCode]);
        client.release();

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            console.log('Compétence non trouvée');
            res.status(404).send('Compétence non trouvée');
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des compétences:', err);
        res.status(500).send('Erreur serveur');
    }
});


module.exports = router;
