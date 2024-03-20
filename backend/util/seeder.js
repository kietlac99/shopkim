/* eslint-disable require-jsdoc */
/**
 * Run the scripts to create initial data
 * @returns {Promise<boolean>}
 */

import logger from '../../backend/api/logger';

import ProductModel from '../schema/product.model';
import products from '../data/product.json';

export default async function dummySomeData() {
  try {
    await ProductModel.deleteMany();
    console.log('Products are deleted');

    await ProductModel.insertMany(products);
    logger.info('dummySomeData done');
    return true;
  } catch (error) {
    throw error;
  }
}
