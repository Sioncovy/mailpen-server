import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  content: string;

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
}

export const MessageSchema = SchemaFactory.createForClass(Message);
