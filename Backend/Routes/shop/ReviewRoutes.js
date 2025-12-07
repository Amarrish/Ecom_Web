const express = require("express");

const {
  addProductReview,
  getProductReviews,
} = require("../../Controllers/shop/ProductReviewController");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;