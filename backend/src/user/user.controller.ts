import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get, Inject,
  Post,
  Put,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../common/page';
import { UserDto } from './user.dto';
import { v4 as UUID } from 'uuid';
import { Response } from 'express';
import { ApiResultCode, ApiResult } from '../common/api-result';
import { JwtService } from '@nestjs/jwt';
import { AuthInterceptor } from '../auth-interceptor';
import { UserAuth, UserAuthOperation } from './user-auth';

@Controller()
export class UserController {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
  }


  @Get('/api/users/page')
  @UseInterceptors(ClassSerializerInterceptor)
  async page(@Query() userDto: UserDto) {
    const r = new ApiResult();
    const page = new Page<User>();
    await this.userRepository.createQueryBuilder('u')
      .skip(userDto.pageNo - 1)
      .take(userDto.pageSize)
      .getManyAndCount()
      .then(value => {
        page.data = value[0];
        page.total = value[1];
      });
    page.pageNo = userDto.pageNo;
    page.pageSize = userDto.pageSize;
    // 分页总数，总记录数 / 页条数，当存在小数点，使用了 Math.ceil 直接网上取整数
    page.totalPage = Math.ceil(page.total / page.pageSize);
    r.result = page;
    return r;
  }

  @Post('/api/users/save')
  async save(@Body() dto: UserDto, @Res() res: Response) {
    const r = new ApiResult();
    let user: User = new User();
    user.username = dto.username;
    user.roleType = dto.roleType;
    user.passwordSalt = UUID();
    user.password = User.getMd5Password(user.passwordSalt, dto.password);
    user = await this.userRepository.save(user);
    r.result = {
      username: user.username,
    };
    return res.json(r);
  }

  @Put('/api/users/update')
  async update(@Body() dto: UserDto, @Res() res: Response) {
    const user: User = await this.userRepository.findOne({ id: dto.id });
    if (dto.roleType) {
      user.roleType = dto.roleType;
    }
    if (dto.password) {
      user.passwordSalt = UUID();
      user.password = User.getMd5Password(user.passwordSalt, dto.password);
    }
    await this.userRepository.save(user);
    return res.json(new ApiResult());
  }


  @Post('/api/users/login')
  async login(@Body() dto: UserDto, @Res() res: Response) {
    const ar = new ApiResult();
    const user: User = await this.userRepository.findOne({ username: dto.username });
    if (!user) {
      ar.remind(ApiResultCode['101']);
      return res.json(ar);
    }

    const md5Password = User.getMd5Password(user.passwordSalt, dto.password);
    if (user.password !== md5Password) {
      ar.remind(ApiResultCode['102']);
      return res.json(ar);
    }
    const accessToken = this.jwtService.sign({
      username: user.username,
      roleType: user.roleType,
      permissionList: [],
    } as UserAuth, { expiresIn: UserAuthOperation.expiresIn });
    ar.result = {
      accessToken: accessToken,
    };
    return res.json(ar);
  }

  @Post('/api/users/loginByAccessToken')
  async loginByAccessToken(@Body() dto: UserDto, @Res() res: Response) {

    const ar = new ApiResult();
    let user = this.jwtService.decode(dto.accessToken, { json: true });
    if (!user) {
      ar.remind(ApiResultCode['103']);
      return res.json(ar);
    }
    user = user as UserDto;
    if (user.exp - user.iat >= 30) {
      ar.remind(ApiResultCode['104']);
      return res.json(ar);
    }
    return res.json(ar);
  }

}
