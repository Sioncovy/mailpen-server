import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  nickname: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  salt: string;

  // @Prop({ required: true })
  // status: number;

  @Prop({
    required: true,
    default: 'https://avatars.githubusercontent.com/u/74760542?v=4',
  })
  avatar: string;

  // @Prop()
  // bio: string;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.salt;
    delete ret.__v;
    return ret;
  },
});

export { UserSchema };
