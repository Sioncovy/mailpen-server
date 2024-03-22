import { UserDocument } from 'src/servers/user/entities/user.entity';

export type UserPublic = Omit<UserDocument, 'password' | 'salt' | '__v'>;
