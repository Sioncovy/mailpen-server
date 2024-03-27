import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { FriendStatus } from 'src/types';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  // 用户 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: ObjectId;

  // 好友 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  friend: ObjectId;

  // 当前好友状态
  @Prop({
    required: true,
    enum: FriendStatus,
    default: FriendStatus.Normal,
  })
  status: FriendStatus;

  // 好友申请记录 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'Request' })
  request: ObjectId;

  // 备注
  @Prop()
  remark: string;

  // 分组
  @Prop()
  group: string;

  // 特别关心
  @Prop()
  star: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
