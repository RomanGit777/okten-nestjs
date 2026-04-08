import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { EnvService } from './shared/services/env.service';

// This file defines a NestJS module whose only job is to configure TypeORM and connect your app to your MySQL database.
// It's basically the "database connection setup" for your whole application.

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (envService: EnvService) => ({
        type: envService.DB_TYPE as 'mysql',
        host: envService.DB_HOST,
        port: envService.DB_PORT,
        username: envService.DB_USER,
        password: envService.DB_PASS,
        database: envService.DB_NAME,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
      }),
      inject: [EnvService],
    }),
  ],
})
export class TypeormModule {}
