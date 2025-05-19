const Product = require("../models/product"); // "../models/product" olarak düzeltildi
const ProductFilter = require("../utils/productFilter");
const cloudinary = require("cloudinary").v2;

const allProducts = async (req, res) => {
  const resultPerPage = 10;
  const productFilter = new ProductFilter(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await productFilter.query;

  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//admin products
const adminProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
};

const getProductDetails = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  res.status(200).json({
    success: true,
    product,
  });
};

//create product
const createProduct = async (req, res) => {
  const imasges = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images.push(...req.body.images);
  }
  let allImages = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });
    allImages.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = allImages;
  req.body.user = req.user.id;

  const { name, price, description, stock, category, images } = req.body;

  const product = await Product.create({
    name,
    price,
    description,
    stock,
    category,
    images,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    product,
  });
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }
  await product.remove();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  const images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images.push(...req.body.images);
  }

  // If images are not undefined, delete the old images from cloudinary
  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }
  }

  let allImages = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });
    allImages.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = allImages;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
};

//! Create new review or update the review
const createReview = async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);

  product.reviews.push(review);

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.rating = avg / product.reviews.length;
  await product.save((validateBeforeSave = true));

  res.status(200).json({
    success: true,
    message: "Review added successfully",
  });
};

module.exports = {
  allProducts,
  getProductDetails,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  adminProducts,
};
