//Import
const express = require("express");
const router = express.Router();
const housesControllers = require("../controllers/housesControllers");
const publicUpload = require("../middlewares/fileUpload");

// Index
router.get("/", housesControllers.index);

// Show
router.get("/:slug", housesControllers.show);

// Store - house
router.post("/", publicUpload.array("foto", 10), housesControllers.storeHouse);

// Store - house review
router.post("/:id/review", housesControllers.storeReview);

// Store - house like
router.post("/:id/like", housesControllers.storeLike);

module.exports = router;