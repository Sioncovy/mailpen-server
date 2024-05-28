import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/servers/user/user.service';
import { UserPublic } from 'src/types';
import { encryptPassword, genBaseErr } from 'src/utils';
import { LoginUserDto } from '../user/dto/login-user.dto';
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
      genBaseErr('用户不存在');
    }
    const salt = user.salt;
    if (user.password !== encryptPassword(password, salt)) {
      genBaseErr('账号或密码错误');
    }
    return user.toObject();
  }

  async login(body: LoginUserDto) {
    const user = await this.validateUser(body.username, body.password);
    console.log('✨  ~ AuthService ~ login ~ user:', user);
    return {
      accessToken: this.jwtService.sign(user),
      // uploadToken: await this.getUploadToken(),
      userInfo: user,
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
