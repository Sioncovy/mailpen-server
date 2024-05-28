import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from 'src/decorators/public.decorator';
import { Body } from '@nestjs/common/decorators';
import { genBaseErr } from 'src/utils';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post('sendCode')
  async sendEmailCode(@Body() data) {
    if (!data?.email) {
      genBaseErr('邮箱不能为空');
    }
    // 校验邮箱格式
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!reg.test(data.email)) {
      genBaseErr('邮箱格式错误');
    }
    return await this.emailService.sendEmailCode(data);
  }
}
