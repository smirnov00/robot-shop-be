import { findAll, findOneById, create } from './products.service';
import { createProductSchema, uuidSchema } from './request-schemas';
import {
  successfulResponse, badRequestRespose, notFoundResponse, internalErrorResponse
} from './response-utils';

export const getProductsList = async () => {
  const res = await findAll();
  return successfulResponse(res);
};

export const getProductById = async (event) => {
  const { productId } = event.pathParameters;
  const { error } = uuidSchema.validate(productId);

  if (error) {
    return badRequestRespose('Invalid product Id');
  }

  const product = await findOneById(productId);

  return product
    ? successfulResponse({ product })
    : notFoundResponse({ message: `Product id: ${productId} not found` });
}

export const createProduct = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch(err) {
    return badRequestRespose('Cannot parse JSON request body');
  }

  const { value: validPayload, error } = createProductSchema.validate(body);

  if (error) {
    return badRequestRespose(error.details.map(({ message }) => message));
  }

  try {
    await create(validPayload);
    return successfulResponse(null, 204);
  } catch(e) {
    return internalErrorResponse();
  }
}
