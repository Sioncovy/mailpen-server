import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendRequestStatus, FriendStatus, UserPublic } from 'src/types';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactDocument } from './entities/contact.entity';
import { RequestDocument } from './entities/request.entity,';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('Contact')
    private readonly contactModel: Model<ContactDocument>,
    @InjectModel('Request')
    private readonly requestModel: Model<RequestDocument>,
  ) {}

  async createContactRequest(body: CreateContactDto, user: UserPublic) {
    const request = new this.requestModel({
      user: user.id,
      friend: body.friendId,
      reason: body.reason,
      status: FriendRequestStatus.Pending,
    });
    return await request.save();
  }

  async queryContactRequestList(user: UserPublic) {
    const userId = user._id;
    // 查询Contact表中与该用户相关的所有未确认好友记录
    const requestList = await this.requestModel
      .find({
        $or: [{ user: userId }, { friend: userId }],
        status: FriendRequestStatus.Pending,
      })
      .populate(['user', 'friend'])
      .exec();
    return requestList;
  }

  async queryContactList(user: UserPublic) {
    const userId = user._id;
    // 查询Contact表中与该用户相关的所有已确认好友记录
    const contactList = await this.contactModel
      .find({ user: userId })
      .populate('friend')
      .exec();
    return contactList;
  }

  async approveContactRequest(requestId: string) {
    // 更新好友请求状态为已接受
    const request = await this.requestModel
      .findByIdAndUpdate(requestId, {
        status: FriendRequestStatus.Accepted,
      })
      .exec();
    // from user to friend
    await new this.contactModel({
      user: request.user,
      friend: request.friend,
      status: FriendStatus.Normal,
      request: request._id,
    }).save();
    // from friend to user
    await new this.contactModel({
      user: request.friend,
      friend: request.user,
      status: FriendStatus.Normal,
      request: request._id,
    }).save();
  }
}
