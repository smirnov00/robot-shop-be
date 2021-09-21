import * as pg from 'pg';
import { Sequelize } from 'sequelize';

const { PG_HOST, PG_DB_NAME, PG_USER, PG_PASSWORD } = process.env;

export const sequelize = new Sequelize(PG_DB_NAME, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  dialect: 'postgres',
  dialectModule: pg,
  pool: {
    max: 1,
    min: 0,
    idle: 1000,
  },
});
