import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactSchema } from './entities/contact.entity';
import { RequestSchema } from './entities/request.entity,';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }]),
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
    MessageModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
