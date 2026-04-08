import { Module } from '@nestjs/common';
import { TablesModule } from './tables/tables.module';
import { TypeormModule } from './typeorm.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { CatchEverythingFilter } from './shared/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    TablesModule,
    TypeormModule,
    AuthModule,
    ConfigModule.forRoot(),
    SharedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule {}
