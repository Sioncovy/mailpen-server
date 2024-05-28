import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ErrorCode } from 'src/constants/error-code';
import { Public } from 'src/decorators/public.decorator';
import { CommonError } from 'src/errors/common.error';
import { AuthService } from 'src/servers/auth/auth.service';
import { genBaseErr } from 'src/utils';
import { RedisIntance } from 'src/utils/redis';
import { ToolsService } from 'src/utils/tools.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private toolsService: ToolsService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    console.log('✨  ~ UserController ~ login ~ body:', body);
    const redis = await RedisIntance.initRedis('user.login', 0);
    const { code, timestamp } = body;

    const lcode = code?.toLowerCase();
    const rawcode = (await redis.get(`authCode-${timestamp}`))?.toLowerCase();
    if (lcode !== rawcode) {
      genBaseErr('验证码错误');
    }
    return this.authService.login(body);
  }

  @Public()
  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    const { username, code } = body;
    const redis = await RedisIntance.initRedis('user.register', 0);
    const rawcode = await redis.get(`emailCode-${username}`);
    if (code?.toLowerCase() !== rawcode?.toLowerCase()) {
      genBaseErr('邮箱验证码错误');
    }

    return this.userService.register(body);
  }

  @Get('/profile')
  async getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Get('/authCode')
  async getCode(@Query() query) {
    const { timestamp } = query;

    const svgCaptcha = await this.toolsService.captCha();

    const redis = await RedisIntance.initRedis('user.authCode', 0);
    await redis.setex(`authCode-${timestamp}`, 60 * 3, svgCaptcha.text);

    return svgCaptcha.data;
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new CommonError(ErrorCode.UserNotFound, '用户不存在');
    }
    return user.toObject();
  }

  @Put('resetPassword')
  async resetPassword(@Body() body: { password: string }, @Req() req) {
    return this.userService.resetPassword({
      ...body,
      id: req.user.id,
    });
  }
}
