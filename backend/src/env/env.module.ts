import { Module } from '@nestjs/common';
import { EnvController } from './env.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { Env } from './env.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Env]), JwtModule.register({ secret: 'hard!to-guess_secret' })],
  controllers: [EnvController],
})
export class EnvModule {
}
