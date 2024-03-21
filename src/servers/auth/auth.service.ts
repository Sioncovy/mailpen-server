import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/constants/error-code';
import { CommonError } from 'src/errors/common.error';
import { UserDocument } from 'src/servers/user/entities/user.entity';
import { UserService } from 'src/servers/user/user.service';
import { encryptPassword } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new CommonError(ErrorCode.UserNotFound, '用户名不存在');
    }
    const salt = user.salt;
    if (user.password !== encryptPassword(password, salt)) {
      throw new CommonError(ErrorCode.UserAuthError, '账号或密码错误');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async login(body: UserDocument) {
    const payload = { username: body.username, sub: body._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
