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
 * Vérifie les identifiants d'un employé pour se connecter.
 * @input : email (string), password (string)
 * @output : user (object) - Informations de l'utilisateur en cas de succès ou message d'erreur.
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM EMPLOYEE WHERE email = $1 AND password = $2',
            [email, password]
        );
        client.release();

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login successful', user: result.rows[0] });
        } else {
            res.status(401).json({ message: 'Identifiants invalides.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
