import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { FriendRequestStatus } from 'src/types';

export type RequestDocument = Request & Document;

@Schema({ timestamps: true })
export class Request {
  // 用户 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: ObjectId;

  // 好友 id
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  friend: ObjectId;

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
