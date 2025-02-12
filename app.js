// Import
const express = require('express');
const housesRoutes = require("./routes/housesRoutes");
const pageNotFound = require('./middlewares/pageNotFound');
const errorsHandler = require('./middlewares/errorsHandler');
const cors = require('cors');

// Creazione app express
const app = express();
const port = process.env.SERVER_PORT;

// Cors
app.use(cors({
    origin: process.env.FRONTEND_URL
}))

// Middleware per rendere la cartella publica accessibile
app.use(express.static('public'));

// Middleware che fa il parse json
app.use(express.json());

// Definisce le rotte
app.use("/houses", errorsHandler, housesRoutes);

// Middleware per la gestione degli errori
app.use(errorsHandler);
app.use(pageNotFound);

app.listen(port, () => {
    console.log(`app is listening on ${port}`);
});