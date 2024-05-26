import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema, Types } from 'mongoose';
import { ChatMessageType, MessageSpecialType } from 'src/types';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    required: true,
    type: MongoSchema.Types.Mixed,
  })
  content: any;

  @Prop({ required: true })
  type: ChatMessageType;

  @Prop({
    required: true,
    default: MessageSpecialType.Normal,
  })
  special: MessageSpecialType;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Contact',
    match: /^friend$/,
  })
  sender: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Contact',
    match: /^friend$/,
  })
  receiver: string;

  @Prop({
    required: true,
    default: false,
  })
  read: boolean;
}

const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
MessageSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export { MessageSchema };
