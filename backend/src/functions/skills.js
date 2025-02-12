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
        const result = await client.query('SELECT * FROM SKILL');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des compétences:', err);
        res.status(500).send('Erreur serveur');
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

//à vérifier
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
