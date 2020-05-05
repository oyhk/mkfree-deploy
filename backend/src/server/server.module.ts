import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './server.entity';
import { Env } from '../env/env.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server,Env])],
  controllers: [ServerController]
})
export class ServerModule {}
