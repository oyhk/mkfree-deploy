import { Module } from '@nestjs/common';
import { EnvController } from './env.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { Env } from './env.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Env])],
  controllers: [EnvController],
})
export class EnvModule {
}
