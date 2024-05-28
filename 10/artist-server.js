const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

const router = require("./scripts/artists_router");

app.use("/api/artists", router);

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
