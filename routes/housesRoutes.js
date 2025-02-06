//Import
const express = require("express");
const router = express.Router();
const housesControllers = require("../controllers/housesControllers");

// Index
router.get("/", housesControllers.index);

// Show
router.get("/:slug", housesControllers.show);

// Store
router.post("/", housesControllers.store);

// Destroy
router.delete("/:id", housesControllers.destroy);

module.exports = router;