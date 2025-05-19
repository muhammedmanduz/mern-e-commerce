const express = require("express");
const {
  allProducts,
  getProductDetails,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  adminProducts, // adminProducts fonksiyonu eklendi
} = require("../controllers/productController"); // "./controllers" → "../controllers" olarak düzeltildi
const { authenticationMiddleware, roleChecked } = require("../middleware/auth");
const router = express.Router();

router.get("/products", allProducts);
router.get("/product/:id", getProductDetails);
router.post(
  "/product/new",
  authenticationMiddleware,
  roleChecked("admin"),
  createProduct
);
router.delete(
  "/product/:id",
  authenticationMiddleware,
  roleChecked("admin"),
  deleteProduct
);
router.put(
  "/product/:id",
  authenticationMiddleware,
  roleChecked("admin"),
  updateProduct
);
router.post("/product/newReview", authenticationMiddleware, createReview);
router.get(
  "/admin/products",
  authenticationMiddleware,
  roleChecked("admin"),
  adminProducts
); // adminProducts fonksiyonu için route

module.exports = router;
