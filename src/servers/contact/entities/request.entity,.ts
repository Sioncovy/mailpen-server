import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from 'src/servers/user/entities/user.entity';
import { FriendRequestStatus } from 'src/types';

export type RequestDocument = Request & Document;

@Schema({ timestamps: true })
export class Request {
  // 用户 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: UserDocument;

  // 好友 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  friend: UserDocument;

  // 当前好友状态
  @Prop({
    required: true,
    enum: FriendRequestStatus,
    default: FriendRequestStatus.Pending,
  })
  status: FriendRequestStatus;

  // 申请原因
  @Prop()
  reason: string;
}

const RequestSchema = SchemaFactory.createForClass(Request);
RequestSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
export { RequestSchema };
