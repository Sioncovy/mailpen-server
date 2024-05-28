import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // 创建好友请求
  @Post('requests')
  async createContactRequest(@Req() req, @Body() body: CreateContactDto) {
    const { user } = req;
    return await this.contactService.createContactRequest(body, user);
  }

  // 查询好友请求列表
  @Get('requests')
  async queryContactRequestList(@Req() req) {
    const { user } = req;
    return await this.contactService.queryContactRequestList(user);
  }

  // 查询好友列表
  @Get()
  async queryContactList(@Req() req) {
    const { user } = req;
    return await this.contactService.queryContactList(user);
  }

  // 更新好友信息
  @Put(':id')
  async updateContact(
    @Param('id') friendId: string,
    @Req() req,
    @Body() body: UpdateContactDto,
  ) {
    console.log('✨  ~ ContactController ~ body:', body);
    const { user } = req;
    return await this.contactService.updateContact(friendId, user, body);
  }

  // 同意好友请求
  @Post('requests/:id/approve')
  async approveContactRequest(@Param('id') requestId: string, @Req() req) {
    const userId = req.user._id;
    return await this.contactService.approveContactRequest(requestId, userId);
  }

  // 查询好友信息
  @Get(':id')
  async queryContact(@Param('id') friendId: string, @Req() req) {
    const userId = req.user._id;
    return await this.contactService.queryContact(friendId, userId);
  }

  // 删除好友
  @Delete(':id')
  async deleteContact(@Param('id') friendId: string, @Req() req) {
    const userId = req.user._id;
    return await this.contactService.deleteContact(friendId, userId);
  }
}
