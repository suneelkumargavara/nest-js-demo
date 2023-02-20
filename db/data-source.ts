import { Report } from '../src/entities/reports.entity';
import { User } from '../src/entities/users.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Report],
  migrations: ['dist/db/migrations/1676831520037-Initial.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
