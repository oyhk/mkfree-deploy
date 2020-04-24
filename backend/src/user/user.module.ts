import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({ secret: 'hard!to-guess_secret' })],
  providers: [],
  controllers: [UserController],
})
export class UserModule {

}
