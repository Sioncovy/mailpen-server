import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory() {
        return {
          storage: diskStorage({
            //文件储存位置
            destination: 'uploads',
            //文件名定制
            filename: (req, file, callback) => {
              const path =
                Date.now() +
                '-' +
                Math.round(Math.random() * 1e10) +
                extname(file.originalname);
              callback(null, path);
            },
          }),
        };
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
