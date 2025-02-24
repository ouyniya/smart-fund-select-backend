const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const wishlistControllers = require("../controllers/wishlist-controller");

router.get("/", authenticate, wishlistControllers.getAllWishlist);

router.post("/", authenticate, wishlistControllers.createWishlist);

router.put("/:wishlistId", authenticate, wishlistControllers.updateWishlist);

router.delete("/:wishlistId", authenticate, wishlistControllers.deleteWishlist);

module.exports = router;