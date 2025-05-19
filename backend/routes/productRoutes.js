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

const router = express.Router();

router.get("/products", allProducts);
router.get("/product/:id", getProductDetails);
router.post("/product", createProduct);
router.delete("/product/:id", deleteProduct);
router.put("/product/:id", updateProduct);
router.post("/product/newReview", createReview);
router.get("/admin/products", adminProducts); // adminProducts fonksiyonu için route

module.exports = router;
