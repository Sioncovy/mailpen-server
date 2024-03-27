import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('requests')
  async createContactRequest(@Req() req, @Body() body: CreateContactDto) {
    const { user } = req;
    return await this.contactService.createContactRequest(body, user);
  }

  @Get('requests')
  async queryContactRequestList(@Req() req) {
    const { user } = req;
    return await this.contactService.queryContactRequestList(user);
  }

  @Get()
  async queryContactList(@Req() req) {
    const { user } = req;
    return await this.contactService.queryContactList(user);
  }

  @Post('requests/:id/approve')
  async approveContactRequest(@Param('id') requestId: string) {
    return await this.contactService.approveContactRequest(requestId);
  }
}
