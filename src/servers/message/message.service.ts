import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDocument } from './entities/message.entity';
import { Model } from 'mongoose';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message')
    private readonly messageModel: Model<MessageDocument>,
    @Inject(forwardRef(() => MessageGateway))
    private readonly messageGateway: MessageGateway,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const message = await this.messageModel.create(createMessageDto);
    await message.save();
    return message;
  }

  async read(id: string) {
    const msg = await this.messageModel.findById(id);
    msg.read = true;
    await msg.save();
    this.messageGateway.updateMessage(msg);
  }
}
