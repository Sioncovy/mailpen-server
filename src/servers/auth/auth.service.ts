import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/constants/error-code';
import { CommonError } from 'src/errors/common.error';
import { UserService } from 'src/servers/user/user.service';
import { UserPublic } from 'src/types';
import { encryptPassword } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserPublic> {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new CommonError(ErrorCode.UserNotFound, '用户名不存在');
    }
    const salt = user.salt;
    if (user.password !== encryptPassword(password, salt)) {
      throw new CommonError(ErrorCode.UserAuthError, '账号或密码错误');
    }
    return user.toObject();
  }

  async login(body: UserPublic) {
    const payload = { sub: body._id, ...body };
    delete payload._id;
    return {
      access_token: this.jwtService.sign(payload),
      userInfo: body,
    };
  }
}
