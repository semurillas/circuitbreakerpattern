"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const port = 8080;
app.get('/', (req, res) => {
    //generate random number for response 200 or 400
    if (Math.random() > 0.5) {
        res.status(200).send("sRespuesta procesada!");
    }
    else {
        res.status(400).send("Caido");
    }
});
//start server on port ${port}
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});
