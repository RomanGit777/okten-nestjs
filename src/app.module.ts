import { Module } from '@nestjs/common';
import { TablesModule } from './tables/tables.module';
import { TypeormModule } from './typeorm.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TablesModule, TypeormModule, AuthModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
