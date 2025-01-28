const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeesRouter = require('./src/functions/employees');
const skillsRouter = require('./src/functions/skills');
const missionsRouter = require('./src/functions/missions');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', employeesRouter);
app.use('/api', skillsRouter);
app.use('/api', missionsRouter);

module.exports = app;



