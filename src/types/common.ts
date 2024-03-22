import { Request } from 'express';
import { UserPublic } from './user';

export interface RequestWithUser extends Request {
  user: UserPublic;
}
