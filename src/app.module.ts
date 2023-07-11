import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Contact } from './entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['**/*.entity.js'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false
      }
    }),
    TypeOrmModule.forFeature([Contact])
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
