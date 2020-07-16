const express = require("express");

const routes = new express.Router();

routes.get("/", (req, res) => {
    res.sendfile(path.join(__dirname, "../build/index.html"));
});

module.exports = routes;