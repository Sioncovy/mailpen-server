import { ObjectId } from 'mongoose';

export class CreateMessageDto {
  content: string;
  sender: ObjectId;
  receiver: ObjectId;
}
