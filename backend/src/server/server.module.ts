import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './server.entity';
import { Env } from '../env/env.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Server,Env]), JwtModule.register({ secret: 'hard!to-guess_secret' })],
  controllers: [ServerController]
})
export class ServerModule {}
