import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async register(body): Promise<User> {
    const user = new this.userModel(body);
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
