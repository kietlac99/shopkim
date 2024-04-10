/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import * as ProductService from "./product.service";
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

export async function getProductsController(req, res) {
  try {
    const query = req.query;
    const process = await ProductService.getProductsService(query);

    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function getAdminProductsController(req, res) {
  try {
    const process = await ProductService.getAdminProductsService();
    
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function newProductController(req, res) {
  try {
    const imageFiles = req.files;

    const productImages = imageFiles.map((item) => item.path);

    try {
      const { body } = req;

      const user = req.user;
      const process = await ProductService.newProductService(body, user, productImages);

      return res.RH.success(process);
    } catch (error) {
      return res.RH.error(error);
    } finally {
      const removeFilePromises = productImages.map((filePath) => promisify(fs.unlink)(filePath));
      await Promise.all(removeFilePromises);
    }
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function getSingleProductController(req, res) {
  try {
    const { productId } = req.params;
    const result = await ProductService.getSingleProductService(productId);

    return res.RH.success(result);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function updateProductController(req, res) {
  try {
    const imageFiles = req.files;

    const productImages = imageFiles.map((item) => item.path);
    try {
      const { productId } = req.params;
      const { body } = req;
      const result = await ProductService.updateProductService(productId, body, productImages);

      return res.RH.success(result);
    } catch (error) {
      return res.RH.error(error);
    } finally {
      const removeFilePromises = productImages.map((filePath) => promisify(fs.unlink)(filePath));
      await Promise.all(removeFilePromises);
    }
    
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function deleteProductController(req, res) {
  try {
    const { productId } = req.params;
    const result = await ProductService.deleteProductService(productId);

    return res.RH.success(result);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function createProductReviewController(req, res) {
  try {
    const { productId, rating, comment } = req.body;
    const { _id, name } = req.user;
    const process = await ProductService.createProductReviewService(
      rating,
      comment,
      productId,
      _id,
      name
    );
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function getProductReviewsController(req, res) {
  try {
    const { productId } = req.query;
    const process = await ProductService.getProductReviewsService(productId);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function deleteReviewController(req, res) {
  try {
    const { productId, reviewId } = req.query;
    const process = await ProductService.deleteReviewService(
      productId,
      reviewId
    );
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function restoreDeletedProductsController(req, res) {
  try {
    const { keyword } = req.body;
    const process = await ProductService.restoreDeletedProductsService(keyword);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function restoreDeletedReviewsController(req, res) {
  try {
    const { keyword } = req.body;
    const process = await ProductService.restoreDeletedReviewsService(keyword);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}
