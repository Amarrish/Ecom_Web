const express = require("express");

const { searchProducts } = require("../../Controllers/shop/SearchController");

const router = express.Router();

router.get("/:keyword", searchProducts);

module.exports = router;