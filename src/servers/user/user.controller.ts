import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from 'src/servers/auth/auth.service';
import { LocalAuthGuard } from 'src/servers/auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    return this.userService.register(body);
  }

  @Get('/profile')
  async getProfile(@Req() req) {
    return req.user;
  }
}
