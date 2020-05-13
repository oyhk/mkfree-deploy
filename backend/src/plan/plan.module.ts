import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { JwtModule } from '@nestjs/jwt';
import { PlanController } from './plan.controller';
import { Env } from '../env/env.entity';
import { Project } from '../project/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Env,Project]), JwtModule.register({ secret: 'hard!to-guess_secret' })],
  controllers: [PlanController],
})
export class PlanModule {
}
