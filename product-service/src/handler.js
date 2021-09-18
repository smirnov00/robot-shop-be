import { findAll, findOneById } from './products.service';

const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const getProductsList = async (event) => {
  return {
    statusCode: 200,
    headers: {
      ...COMMON_HEADERS,
    },
    body: JSON.stringify(findAll()),
  };
};

export const getProductById = async (event) => {
  const { productId } = event.pathParameters;
  const product = findOneById(productId);

  const statusCode = product ? 200 : 404;
  const body = product ? { product } : { message: `Product id: ${productId} not found` }

  return {
    statusCode,
    headers: {
      ...COMMON_HEADERS,
    },
    body: JSON.stringify(body),
  };
}
