import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Contact } from './entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: 'postgres',
      host: 'localhost', 
      type: 'postgres',
      password: 'postgres',
      port: 5432,
      username: 'postgres',
      entities: [Contact],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Contact])
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
