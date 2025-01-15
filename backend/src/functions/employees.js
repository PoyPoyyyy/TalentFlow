// Endpoint pour récupérer les données (exemple)
app.get('/employees', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM EMPLOYEE');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving employees');
    }
});