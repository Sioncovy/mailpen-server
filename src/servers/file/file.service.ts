import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  uploadFile(file: Express.Multer.File) {
    return {
      url: `${this.configService.get('HOST')}/${file.filename}`,
    };
  }
}
