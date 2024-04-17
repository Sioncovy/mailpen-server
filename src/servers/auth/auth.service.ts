import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/constants/error-code';
import { CommonError } from 'src/errors/common.error';
import { UserService } from 'src/servers/user/user.service';
import { UserPublic } from 'src/types';
import { encryptPassword } from 'src/utils';
// import * as qiniu from 'qiniu';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      accessToken: this.jwtService.sign(payload),
      // uploadToken: await this.getUploadToken(),
      userInfo: body,
    };
  }

  // async getUploadToken() {
  //   const mac = new qiniu.auth.digest.Mac(
  //     this.configService.get('QINIU_ACCESSKEY'),
  //     this.configService.get('QINIU_SECRETKEY'),
  //   );

  //   const options = {
  //     scope: this.configService.get('QINIU_BUCKET'),
  //     expires: 60 * 60 * 24 * 7,
  //   };

  //   const putPolicy = new qiniu.rs.PutPolicy(options);
  //   const uploadToken = putPolicy.uploadToken(mac);

  //   return uploadToken;
  // }
}
