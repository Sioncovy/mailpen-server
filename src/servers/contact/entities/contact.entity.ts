import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FriendStatus, UserPublic } from 'src/types';
import { Request } from './request.entity,';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  // 用户 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: UserPublic;

  // 好友 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  friend: UserPublic;

  // 当前好友状态
  @Prop({
    required: true,
    enum: FriendStatus,
    default: FriendStatus.Normal,
  })
  status: FriendStatus;

  // 好友申请记录 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'Request' })
  request: Request;

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

const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
export { ContactSchema };
