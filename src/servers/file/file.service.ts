import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  uploadFile(file: Express.Multer.File) {
    const fileOriginalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf-8',
    );
    return {
      url: `${this.configService.get('HOST')}/${file.filename}`,
      filename: fileOriginalName,
      size: file.size,
    };
  }
}
