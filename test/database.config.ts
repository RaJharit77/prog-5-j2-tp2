import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'rajharit#77',
  database: process.env.DB_NAME_TEST || 'location_db_test',
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
  dropSchema: true,
  retryAttempts: 3,
  retryDelay: 3000,
  extra: {
    max: 1,
  },
};
