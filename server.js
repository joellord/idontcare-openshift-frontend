const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const globalConfig = {
    API_URL: process.env.API_URL,
    HTTP_CAT_URL: process.env.HTTP_CAT_URL,
    AUTH_URL: process.env.AUTH_URL,
    USE_KEYCLOAK: process.env.USE_KEYCLOAK
};

app.use(express.static("."));

app.get("/config", (req, res) => {
    res.status(200).send(globalConfig)
});

app.listen(PORT, () => console.log(`Frontend server started on port ${PORT}`));