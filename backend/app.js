const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeesRouter = require('./src/functions/employees');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', employeesRouter);

module.exports = app;
