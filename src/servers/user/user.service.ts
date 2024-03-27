import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ErrorCode } from 'src/constants/error-code';
import { CommonError } from 'src/errors/common.error';
import { encryptPassword, makeSalt } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async register(body: CreateUserDto) {
    if (
      body.password.length < 6 ||
      body.password.length > 20 ||
      !/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/.test(
        body.password,
      )
    ) {
      throw new CommonError(ErrorCode.UserPasswordError, '密码不符合要求');
    }
    // TODO: 邮箱也要是唯一的
    const isExist = Boolean(await this.findOneByUsername(body.username));
    if (isExist) {
      throw new CommonError(ErrorCode.UserAlreadyExist, '用户名已存在');
    }
    const user = new this.userModel(body);
    const salt = makeSalt();
    const password = encryptPassword(body.password, salt);
    user.password = password;
    user.salt = salt;
    await user.save();
    return user.toObject();
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return null;
    }
    return user;
  }

  async findOneById(id: ObjectId) {
    const user = await this.userModel.findById(id);
    if (!user) {
      return null;
    }
    return user;
  }
}
