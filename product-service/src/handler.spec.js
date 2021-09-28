import { findAll, findOneById, create, createOrUpdate } from './products.service';
import { createProductSchema, uuidSchema } from './request-schemas';
import { sns } from './sns';
import {
  successfulResponse, badRequestRespose, notFoundResponse, internalErrorResponse
} from '../../utils/helpers/response-helpers';

import { getProductsList, getProductById, createProduct, catalogBatchProcess } from './handler';

jest.mock('./sns');
jest.mock('./products.service');
jest.mock('./request-schemas');
jest.mock('../../utils/helpers/response-helpers');

describe('handler', () => {
  beforeEach(() => {
    successfulResponse.mockReturnValue('successful-response');
    badRequestRespose.mockReturnValue('bad-request-response');
    notFoundResponse.mockReturnValue('not-found-response');
    internalErrorResponse.mockReturnValue('internal-error-response');
  });

  describe('getProductsList', () => {
    it('should return products list', async () => {
      findAll.mockResolvedValue(['product1', 'product2']);

      const res = await getProductsList();

      expect(successfulResponse).toHaveBeenCalledWith(['product1', 'product2']);
      expect(res).toBe('successful-response');
    });
  });

  describe('getProductById', () => {
    let event;

    beforeEach(() => {
      event = {
        pathParameters: {
          productId: 'prod-id',
        },
      };

      uuidSchema.validate.mockReturnValue({ value: 'valid-id' });
    });

    it('should return a product', async () => {
      findOneById.mockResolvedValue('product');

      const res = await getProductById(event);

      expect(successfulResponse).toHaveBeenCalledWith({ product: 'product' });
      expect(res).toBe('successful-response');
    });

    it('should return bad-request-response', async () => {
      uuidSchema.validate.mockReturnValue({ error: 'some-error' });

      const res = await getProductById(event);

      expect(badRequestRespose).toHaveBeenCalled();
      expect(res).toBe('bad-request-response');
      expect(uuidSchema.validate).toHaveBeenCalledWith('prod-id');
    });

    it('should return not-found-response', async () => {
      findOneById.mockResolvedValue(null);

      const res = await getProductById(event);

      expect(notFoundResponse).toHaveBeenCalled();
      expect(res).toBe('not-found-response');
    });
  });

  describe('createProduct', () => {
    let event;

    beforeEach(() => {
      event = {
        body: '{"foo": "bar"}',
      };
    });

    it('should return bad request response', async () => {
      event.body = 'invalid-json';

      const res = await createProduct(event);
      
      expect(res).toBe('bad-request-response');
      expect(badRequestRespose).toHaveBeenCalled();
    });

    it('should return bad request response', async () => {
      createProductSchema.validate.mockReturnValue({
        value: '',
        error: {
          details: [{ message: 'error1' }],
        },
      });

      const res = await createProduct(event);

      expect(res).toBe('bad-request-response');
      expect(badRequestRespose).toHaveBeenCalledWith(['error1']);
    });

    it('should return internal error response', async () => {
      createProductSchema.validate.mockReturnValue({
        value: 'valid-payload',
      });
      create.mockRejectedValue('some-error');

      const res = await createProduct(event);

      expect(res).toBe('internal-error-response');
      expect(internalErrorResponse).toHaveBeenCalled();
    });

    it('should return successful response', async () => {
      createProductSchema.validate.mockReturnValue({
        value: 'valid-payload',
      });

      create.mockResolvedValue('new-product');

      const res = await createProduct(event);

      expect(res).toBe('successful-response');
      expect(create).toHaveBeenCalledWith('valid-payload');
      expect(successfulResponse).toHaveBeenCalledWith(null, 204);
    });
  });

  describe('catalogBatchProcess', () => {
    it('should process batch import', async () => {
      const originalEnv = process.env;

      process.env = {
        ...originalEnv,
        SNS_PRODUCTS_IMPORTED_TOPIC: 'sns-topic-arn',
      };

      const event = {
        Records: [{
          body: '{"id":"prod-id-1"}',
        }, {
          body: '{"id":"prod-id-2"}',
        }, {
          body: '{"id":"prod-id-3"}',
        }],
      };

      createProductSchema.validate
        .mockReturnValueOnce({ value: 'prod-1' })
        .mockReturnValueOnce({ error: 'invalid-id' })
        .mockReturnValueOnce({ value: 'prod-3' });
      createOrUpdate.mockResolvedValue({ ok: true });
      sns.publish.mockReturnValue({
        promise: jest.fn().mockResolvedValue(null),
      });
      
      await catalogBatchProcess(event);
      
      expect(createOrUpdate).toHaveBeenCalledTimes(2);
      expect(createOrUpdate).toHaveBeenNthCalledWith(1, 'prod-1');
      expect(createOrUpdate).toHaveBeenNthCalledWith(2, 'prod-3');
      expect(sns.publish).toHaveBeenCalledWith({
        Subject: 'Products Import',
        Message: '2 products have been imported.',
        TopicArn: 'sns-topic-arn',
      });

      process.env = originalEnv;
    });
  });
});
