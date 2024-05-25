import { BadRequestException } from '@nestjs/common';

export * from './cryptogram';

export function genBaseErr(msg: string) {
  throw new BadRequestException(msg);
}
