import { FriendStatus } from 'src/types';

export class UpdateContactDto {
  status?: FriendStatus;
  remark?: string;
  group?: string;
  star?: boolean;
}
