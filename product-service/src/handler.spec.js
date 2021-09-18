import { getProductsList, getProductById } from './handler';
import { findAll, findOneById } from './products.service';

jest.mock('./products.service');

describe('handler', () => {
  describe('getProductsList', () => {
    it('should return list of products', async () => {
      findAll.mockReturnValue([{
        id: 'prodId',
        title: 'prodName'
      }]);

      const res = await getProductsList({});
      expect(res).toEqual({
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify([{
          id: 'prodId',
          title: 'prodName'
        }]),
      });
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
    });

    it('should return the product', async () => {
      findOneById.mockReturnValue({
        id: 'prod-id'
      });

      const res = await getProductById(event);
      
      expect(res).toEqual({
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          product: {
            id: 'prod-id',
          },
        }),
      });
    });

    it('should return 404 status code', async () => {
      findOneById.mockReturnValue(null);

      const res = await getProductById(event);
      
      expect(res).toEqual(expect.objectContaining({
        statusCode: 404,
      }));
    });
  });
});
