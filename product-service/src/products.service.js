import { Product } from './models/product.model';
import { Stock } from './models/stock.model';

const mapProduct = ({ id, title, description, price, stock }) => ({
  id,
  title,
  description,
  price,
  count: stock.count,
});

export const findAll = async () => {
  const products = await Product.findAll({
    include: ['stock'],
  });

  return products.map(mapProduct);
};

export const findOneById = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: ['stock'],
  });
  return product ? mapProduct(product) : null;
};

export const create = async ({ id, title, description, price, count }) => {
  const product = await Product.create({
    id, 
    title,
    description,
    price,
    stock: {
      count,
    },
  }, { include: ['stock'] });

  return product;
};

export const update = async (id, fields) => {
  const { count, ...productFields } = fields;

  await Product.update(productFields, {
    where: { id },
  });

  if (count || count === 0) {
    await Stock.update({ count }, {
      where: { product_id: id},
    });
  }
};

export const createOrUpdate = async (fields) => {
  const { id } = fields;
  const product = await findOneById(id);

  return !!product ? update(id, fields) : create(fields);
};
