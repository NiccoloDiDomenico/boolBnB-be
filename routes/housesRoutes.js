//Import
const express = require("express");
const router = express.Router();
const housesControllers = require("../controllers/housesControllers");

// Index
router.get("/", housesControllers.index);

// Show
router.get("/:id", housesControllers.show);

module.exports = router;