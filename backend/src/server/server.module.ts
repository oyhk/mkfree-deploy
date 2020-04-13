import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server])],
  controllers: [ServerController]
})
export class ServerModule {}
