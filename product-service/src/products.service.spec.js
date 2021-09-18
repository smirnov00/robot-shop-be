import { findAll, findOneById } from './products.service';

describe('products.service', () => {
  describe('findAll', () => {
    it('should return array of products', () => {
      const res = findAll();

      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBeGreaterThan(0);
    });
  });

  describe('findOneById', () => {
    it('should return one product', () => {
      const res = findOneById('a55cf7eb-66ad-440a-8762-8a6ea68da4fe');
      expect(res).toBeTruthy();
    });
  });
});
