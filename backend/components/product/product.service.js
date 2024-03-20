/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import colors from "colors";

import { ERROR_CODE } from "../../constants";
import errorMessage from "../../util/error";

import ProductModel from "../../schema/product.model";
import APIFeatures from "../../util/apiFeatures";
import cloudinary from 'cloudinary';

export async function newProductService(body, user, productImages) {
  try {
    
    let imagesLinks = [];
   
    for (let i = 0; i < productImages.length; i++) {
      const result = await cloudinary.v2.uploader.upload(productImages[i], {
        folder: `ShopKim/product/${body.category}`
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }

    const product = {
      name: body.name,
      price: body.price,
      description: body.description,
      images: imagesLinks,
      category: body.category,
      seller: body.seller,
      stock: body.stock,
      user: user._id,
    };

    const createProduct = await ProductModel.create(product);
    return createProduct;
  } catch (error) {
    console.log(colors.red(`newProductService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function getProductsService(query) {
  try {
    const resPerPage = 4;
    const productsCount = await ProductModel.countDocuments();

    const apiFeatures = new APIFeatures(ProductModel.find(), query)
      .search()
      .filter();

    let products = await apiFeatures.query.clone();
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;

    const payload = {
      productsCount,
      resPerPage,
      filteredProductsCount,
      products,
    };
    return payload;
  } catch (error) {
    console.log(colors.red(`getProductsService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

// Get all products (Admin) => /api/v1/product/admin/products
export async function getAdminProductsService() {
  try {
    const products = await ProductModel.find().lean();

    const payload = {
      products
    };
    return payload;
  } catch (error) {
    console.log(colors.red(`getProductsService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function getSingleProductService(productId) {
  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return errorMessage(404, "Lỗi, không tìm thấy sản phẩm!");
    }
    return product;
  } catch (error) {
    console.log(colors.red(`getSingleProductService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function updateProductService(productId, body, productImages) {
  try {
    let product = await ProductModel.findById(productId);

    if (!product) {
      return errorMessage(404, "Lỗi, không tìm thấy sản phẩm!");
    }

    let imagesLinks = [];

    console.log(productImages);

    if (productImages.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        // Deleting images associated with the product
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
   
      for (let i = 0; i < productImages.length; i++) {  
        const result = await cloudinary.v2.uploader.upload(productImages[i], {
          folder: `ShopKim/product/${body.category}`
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    } else imagesLinks = product?.images;

    product = await ProductModel.findByIdAndUpdate(
      { _id: productId },
      {
        name: body.name,
        price: body.price,
        description: body.description,
        images: imagesLinks,
        category: body.category,
        seller: body.seller,
        stock: body.stock,
      },
      {
        new: true,
      }
    );

    return product;
  } catch (error) {
    console.log(colors.red(`updateProductService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteProductService(productId) {
  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return errorMessage(404, ERROR_CODE.NOT_FOUND_ERROR);
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await ProductModel.deleteOne({ _id: productId });
    const result = "Product is deleted!";
    return result;
  } catch (error) {
    console.log(colors.red(`deleteProductService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function createProductReviewService(
  rating,
  comment,
  productId,
  userId,
  userName
) {
  try {
    const review = {
      user: userId,
      name: userName,
      rating: Number(rating),
      comment,
    };

    const product = await ProductModel.findById(productId);

    const isReviewed = product.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === userId.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return true;
  } catch (error) {
    console.log(colors.red(`createProductReviewService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function getProductReviewsService(productId) {
  try {
    const product = await ProductModel.findById(productId);

    return product.reviews;
  } catch (error) {
    console.log(colors.red(`getProductReviewsService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteReviewService(productId, reviewId) {
  try {
    const product = await ProductModel.findById(productId);

    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      reviews.length;

    await ProductModel.findByIdAndUpdate(
      productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    return true;
  } catch (error) {
    console.log(colors.red(`deleteReviewService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}
