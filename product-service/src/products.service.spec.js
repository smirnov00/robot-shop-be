import { findAll, findOneById } from './products.service';
import { Product } from './models/product.model';

jest.mock('./models/product.model');

describe('products.service', () => {
  let mockProduct;

  beforeEach(() => {
    mockProduct = {
      id: 'prod-id',
      title: 'prod-title',
      description: 'prod-description',
      price: 200,
      stock: {
        count: 10,
      },
    };
  });

  describe('findAll', () => {
    it('should return array of products', async () => {
      Product.findAll.mockResolvedValue([mockProduct]);

      const res = await findAll();

      expect(res).toEqual([{
        id: 'prod-id',
        title: 'prod-title',
        description: 'prod-description',
        price: 200,
        count: 10,
      }]);

      expect(Product.findAll).toHaveBeenCalledWith({
        include: ['stock'],
      });
    });
  });

  describe('findOneById', () => {
    it('should return one product', async () => {
      Product.findByPk.mockResolvedValue(mockProduct);

      const res = await findOneById('prod-id');

      expect(res).toEqual({
        id: 'prod-id',
        title: 'prod-title',
        description: 'prod-description',
        price: 200,
        count: 10,
      });

      expect(Product.findByPk).toHaveBeenCalledWith('prod-id', { include: ['stock'] });
    });
  });
});
