import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
      return new Error('User not found');
    }
    const salt = user.salt;
    if (user.password !== encryptPassword(password, salt)) {
      return new Error('Invalid password');
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
