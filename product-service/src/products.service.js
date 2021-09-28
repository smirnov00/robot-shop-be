import { Product } from './models/product.model';

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
  await Product.update(fields, {
    where: { id },
  });
};

export const createOrUpdate = async (fields) => {
  const { id } = fields;
  const product = await findOneById(id);

  return !!product ? update(id, fields) : create(fields);
};
