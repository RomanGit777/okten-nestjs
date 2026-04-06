import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { EnvService } from 'src/shared/services/env.service';

const configService = new ConfigService();
const envService = new EnvService(configService);

export default new DataSource({
  type: envService.DB_TYPE as 'mysql',
  host: envService.DB_HOST,
  port: envService.DB_PORT,
  username: envService.DB_USER,
  password: envService.DB_PASS,
  database: envService.DB_NAME,
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
});
