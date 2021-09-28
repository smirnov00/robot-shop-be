import { findAll, findOneById, create, update } from './products.service';
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

  describe('create', () => {
    it('should create a product', async () => {
      Product.create.mockResolvedValue('new-product');

      const res = await create({
        id: 'prod-id',
        title: 'prod-title',
        description: 'prod-description',
        price: 120,
        count: 25,
      });
      
      expect(Product.create).toHaveBeenCalledWith({
        id: 'prod-id',
        title: 'prod-title',
        description: 'prod-description',
        price: 120,
        stock: {
          count: 25,
        },
      }, { include: ['stock'] });
      expect(res).toBe('new-product');
    });
  });

  describe('update', () => {
    it('should update the product', async () => {
      Product.update.mockResolvedValue(null);

      await update('prod-id', { title: 'updated-title' });

      expect(Product.update).toHaveBeenCalledWith({
        title: 'updated-title'
      }, {
        where: {
          id: 'prod-id',
        },
      });
    });
  });

  // describe('createOrUpdate', () => {
  //   it('should update the product', async () => {

  //   });
  // });
});
