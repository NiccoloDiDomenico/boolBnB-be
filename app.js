// Import
const express = require('express');
const housesRoutes = require("./routes/housesRoutes");
const exp = require('constants');

// Creazione app express
const app = express();
const port = process.env.SERVER_PORT;

// Middleware per rendere la cartella publica accessibile
app.use(express.static('public'));

// Middleware che fa il parse json
app.use(express.json());

// Definisce le rotte
app.use("/houses", housesRoutes);

app.listen(port, () => {
    console.log(`app is listening on ${port}`);
});