import { ObjectId } from 'mongoose';

export class CreateContactDto {
  friendId: ObjectId;
  reason?: string;
}
