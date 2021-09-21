import { DataTypes } from 'sequelize';

import { sequelize } from '../db';

export const Stock = sequelize.define('Stock', {
  product_id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  count: DataTypes.INTEGER,
}, {
  tableName: 'stocks',
  createdAt: false,
  updatedAt: false,
});
