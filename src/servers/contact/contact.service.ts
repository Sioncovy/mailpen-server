import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorCode } from 'src/constants/error-code';
import { CommonError } from 'src/errors/common.error';
import { FriendRequestStatus, FriendStatus, UserPublic } from 'src/types';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactDocument } from './entities/contact.entity';
import { RequestDocument } from './entities/request.entity,';
import { MessageService } from '../message/message.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { genBaseErr } from 'src/utils';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('Contact')
    private readonly contactModel: Model<ContactDocument>,
    @InjectModel('Request')
    private readonly requestModel: Model<RequestDocument>,
    private readonly messageService: MessageService,
  ) {}

  async createContactRequest(body: CreateContactDto, user: UserPublic) {
    const request = new this.requestModel({
      user: new Types.ObjectId(user._id as string),
      friend: new Types.ObjectId(body.friendId),
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
        $or: [
          { user: new Types.ObjectId(userId) },
          { friend: new Types.ObjectId(userId) },
        ],
      })
      .populate(['user', 'friend'])
      .exec();
    return requestList;
  }

  async queryContactList(user: UserPublic) {
    const userId = user._id as string;
    // 查询Contact表中与该用户相关的所有已确认好友记录
    let contactList = await this.contactModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('friend')
      .exec();
    contactList = contactList.map((_) => {
      const friend = _.friend.toObject();
      const contact = _.toObject();
      delete contact.friend;
      delete contact.user;
      return {
        ...contact,
        ...friend,
      };
    });
    return contactList;
  }

  async updateContact(
    contactId: string,
    user: UserPublic,
    body: UpdateContactDto,
  ) {
    const userId = user._id as string;
    const contact = await this.contactModel
      .findOne({
        friend: new Types.ObjectId(contactId),
        user: new Types.ObjectId(userId),
      })
      .exec();
    console.log('✨  ~ ContactService ~ contact:', contact, body);
    if (!contact) {
      throw new genBaseErr('好友不存在');
    }
    contact.remark = body.remark;
    // contact.group = body.group;
    contact.star = body.star;
    return await contact.save();
  }

  async approveContactRequest(requestId: string, userId: string) {
    const request = await this.requestModel.findById(requestId).exec();
    if (
      request.user.toString() !== userId &&
      request.friend.toString() !== userId
    ) {
      throw new CommonError(ErrorCode.RequestIllegal, '操作的好友申请非法');
    }
    // 更新好友请求状态为已接受
    request.status = FriendRequestStatus.Accepted;
    request.save();
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
    await this.messageService.createMessage({
      content: '我们已经成为好友啦，开始聊天吧',
      sender: request.friend.toString(),
      receiver: request.user.toString(),
    });
    return null;
  }

  async queryContact(friendId: string, userId: string) {
    let contact = await this.contactModel
      .findOne({
        user: new Types.ObjectId(userId),
        friend: new Types.ObjectId(friendId),
      })
      .populate('friend')
      .exec();
    if (!contact) {
      throw new genBaseErr('好友不存在');
    }
    const friend = contact.friend.toObject();
    contact = contact.toObject();
    delete contact.friend;
    delete contact.user;
    return {
      ...contact,
      ...friend,
    };
  }
}
