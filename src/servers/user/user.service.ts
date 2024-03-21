import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { encryptPassword, makeSalt } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async register(body: CreateUserDto): Promise<User> {
    if (body.password.length < 6 || body.password.length > 20) {
      throw new Error('Password must be 6-20 characters long');
    }
    // TODO: 邮箱也要是唯一的
    const isExist = Boolean(
      await this.userModel.findOne({
        username: body.username,
      }),
    );
    if (isExist) {
      throw new Error('Username already exists');
    }
    const user = new this.userModel(body);
    const salt = makeSalt();
    const password = encryptPassword(body.password, salt);
    user.password = password;
    user.salt = salt;
    return user.save();
  }

  async findOne(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return null;
    }
    return user.toObject();
  }
}
