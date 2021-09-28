import { findAll, findOneById, create, createOrUpdate } from './products.service';
import { createProductSchema, uuidSchema } from './request-schemas';
import { sns } from './sns';
import {
  successfulResponse, badRequestRespose, notFoundResponse, internalErrorResponse
} from '../../utils/helpers/response-helpers';

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

export const catalogBatchProcess = async (event) => {
  console.log('event', event);

  const { SNS_PRODUCTS_IMPORTED_TOPIC } = process.env;
  const { Records } = event;
  
  const products = Records
    .map(({ body }) => {
      const product = JSON.parse(body);
      return createProductSchema.validate(product);
    })
    .filter(({ error }) => !error);

  console.log('Products to be created:', JSON.stringify(products));
   
  await Promise.all(products.map(({ value }) => createOrUpdate(value)));

  const publishParams = {
    Subject: 'Products Import',
    Message: `${products.length} products have been imported.`,
    TopicArn: SNS_PRODUCTS_IMPORTED_TOPIC,
  };
  console.log('publishing...', publishParams);
  
  await sns.publish(publishParams).promise();
};
