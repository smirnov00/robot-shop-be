import { DataTypes } from 'sequelize';

import { sequelize } from '../db';
import { Stock } from './stock.model';

export const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  price: DataTypes.FLOAT,
}, {
  tableName: 'products',
  createdAt: false,
  updatedAt: false,
});

Product.hasOne(Stock, { as: 'stock', foreignKey: 'product_id' });
