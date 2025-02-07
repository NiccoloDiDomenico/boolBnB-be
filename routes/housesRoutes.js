//Import
const express = require("express");
const router = express.Router();
const housesControllers = require("../controllers/housesControllers");

// Index
router.get("/", housesControllers.index);

// Show
router.get("/:slug", housesControllers.show);

// Store - house
router.post("/", housesControllers.storeHouse);

// Store - house review
router.post("/:id/review", housesControllers.storeReview);

// Store - house like
router.post("/:id/like", housesControllers.storeLike);

// Destroy 
router.delete("/:id", housesControllers.destroy);

module.exports = router;


// {
//     "nome": "Marcolino",
//     "commento": "Fa schifo",
//     "giorni_permanenza": "1",
//     "data_recensione": "2025-02-07",
// }