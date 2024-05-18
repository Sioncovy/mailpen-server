import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
