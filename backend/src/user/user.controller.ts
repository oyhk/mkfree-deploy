import {
  Body,
  ClassSerializerInterceptor,
  Controller, Delete,
  Get, Inject,
  Post,
  Put,
  Query, Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { User, UserRoleType } from './user.entity';
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
  async page(@Query() userDto: UserDto, @Res() res: Response) {
    const ar = new ApiResult();
    const page = new Page<User>();
    await this.userRepository.createQueryBuilder('u').select(['u.id', 'u.username', 'u.roleType', 'u.createdAt'])
      .skip(UserDto.getOffset(UserDto.getPageNo(userDto.pageNo), UserDto.getPageSize(userDto.pageSize)))
      .take(UserDto.getPageSize(userDto.pageSize))
      .getManyAndCount()
      .then(value => {
        page.data = value[0];
        page.total = value[1];
      });
    page.pageNo = userDto.pageNo;
    page.pageSize = userDto.pageSize;
    // 分页总数，总记录数 / 页条数，当存在小数点，使用了 Math.ceil 直接网上取整数
    page.totalPage = Math.ceil(page.total / page.pageSize);
    ar.result = page;
    return res.json(ar);
  }

  @Get('/api/users/info')
  async info(@Query() userDto: UserDto, @Res() res: Response) {
    const ar = new ApiResult();

    const user = await this.userRepository.findOne(userDto.id);
    if (!user) {
      ar.remindRecordNotExist(User.entityName, { id: userDto.id });
      return res.json(ar);
    }
    user.passwordSalt = undefined;
    user.password = undefined;
    user.updatedAt = undefined;
    ar.result = user;
    return res.json(ar);
  }

  @Post('/api/users/save')
  async save(@Body() dto: UserDto, @Req() req, @Res() res: Response) {
    const ar = new ApiResult();

    const accessToken = req.header(UserAuthOperation.accessTokenKey);
    const userAuth = this.jwtService.decode(accessToken.toString()) as UserAuth;
    // 非管理员 无权限删除
    if (userAuth.roleType !== 0) {
      ar.remind(ApiResultCode['12']);
      return res.json(ar);
    }

    let user = await this.userRepository.findOne({ username: dto.username });
    if (user) {
      ar.remind(ApiResultCode['105']);
      return res.json(ar);
    }

    user = new User();
    user.username = dto.username;
    user.roleType = dto.roleType;
    user.passwordSalt = UUID();
    user.password = User.getMd5Password(user.passwordSalt, dto.password);
    user = await this.userRepository.save(user);
    ar.result = {
      username: user.username,
    };
    return res.json(ar);
  }

  @Put('/api/users/update')
  async update(@Body() dto: UserDto, @Req() req, @Res() res: Response) {
    const ar = new ApiResult();

    const accessToken = req.header(UserAuthOperation.accessTokenKey);
    const userAuth = this.jwtService.decode(accessToken.toString()) as UserAuth;

    const user: User = await this.userRepository.findOne({ id: dto.id });

    // 非管理员 并且 修改密码不是本人 无权限修改
    if (userAuth.roleType !== 0 && user.id !== userAuth.id) {
      ar.remind(ApiResultCode['12']);
      return res.json(ar);
    }

    if (dto.password) {
      user.passwordSalt = UUID();
      user.password = User.getMd5Password(user.passwordSalt, dto.password);
    }
    if (dto.roleType !== null) {
      user.roleType = dto.roleType;
    }
    await this.userRepository.save(user);
    return res.json(ar);
  }

  @Delete('/api/users/delete')
  async delete(@Body() dto: UserDto, @Req() req, @Res() res: Response) {
    const ar = new ApiResult();

    const accessToken = req.header(UserAuthOperation.accessTokenKey);
    const userAuth = this.jwtService.decode(accessToken.toString()) as UserAuth;
    // 非管理员 无权限删除
    if (userAuth.roleType !== 0) {
      ar.remind(ApiResultCode['12']);
      return res.json(ar);
    }

    const user = await this.userRepository.findOne(dto.id);
    if (!user) {
      ar.remindRecordNotExist(User.entityName, { id: dto.id });
      return res.json(ar);
    }
    if (user.roleType === UserRoleType.superAdmin) {
      ar.remind(ApiResultCode['106']);
      return res.json(ar);
    }

    await this.userRepository.delete(dto.id);

    return res.json(ar);
  }


  @Post('/api/users/login')
  async login(@Body() dto: UserDto, @Res() res: Response) {
    const ar = new ApiResult();
    const user = await this.userRepository.findOne({ username: dto.username });
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
      id: user.id,
      username: user.username,
      roleType: user.roleType,
      permissionList: [],
    } as UserAuth, { expiresIn: UserAuthOperation.expiresIn });
    ar.result = {
      username: user.username,
      accessToken: accessToken,
    };
    return res.json(ar);
  }

  @Post('/api/users/logout')
  async logout(@Body() dto: UserDto, @Res() res: Response) {
    const ar = new ApiResult();
    return ar;
  }

}
