import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessDto } from '../common/dto/success.dto';
import { ImageDto } from '../common/dto/image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SwaggerObjectS3Dto } from './dto/swagger-object-s3.dto';
import { S3Service } from './s3.service';
import { CustomApiResponse } from '../common/decorator/custom.decorator';
import { PostPutSuccessDto } from '../common/dto/post-put-success.dto';
import { Response } from 'express';
import { isEmpty } from '../common/util/common.util';

@ApiBearerAuth('authorization')
@ApiSecurity('api-key')
@ApiTags('File Upload')
@Controller('s3')
export class S3Controller {
  constructor(private readonly fileUploadService: S3Service) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '파일 단일 업로드',
    description: '파일을 단일 업로드합니다.',
  })
  @ApiBody({ type: ImageDto })
  @CustomApiResponse(SwaggerObjectS3Dto)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: Number(process.env.FILE_UPLOAD_SIZE) * 1024 * 1024, //초과 시 statusCode : 413
      },
      fileFilter: (req, file, callback) => {
        const type = file.mimetype.split('/')[1];
        const enable = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
        if (enable.indexOf(type) === -1) {
          // 파일 확장자 검사
          return callback(
            new BadRequestException(
              '허용되지 않은 확장자입니다. jpg, png, gif, pdf 만 업로드할 수 있습니다.',
            ),
            false,
          );
        }

        return callback(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ): Promise<SuccessDto> {
    const { ...imageDto }: ImageDto = body;
    return await this.fileUploadService.uploadFile(file, imageDto.folderName);
  }

  @Delete()
  @ApiOperation({
    summary: '파일 단일 삭제',
    description: '파일을 단일 삭제합니다.',
  })
  @ApiQuery({
    name: 'folder_name',
    description: '폴더명',
    required: true,
    example: 'board',
  })
  @ApiQuery({
    name: 'file_name',
    description: '파일명',
    required: true,
    example: '46pDXDhCWpZ8A3kQTgpJT7.png',
  })
  @CustomApiResponse(PostPutSuccessDto)
  async deleteImage(
    @Query('folder_name') folder_name = 'images',
    @Query('file_name') file_name: string,
  ): Promise<SuccessDto> {
    if (isEmpty(file_name)) throw new BadRequestException('파일명이 없습니다.');

    return await this.fileUploadService.deleteFile(
      `${folder_name}/${file_name}`,
    );
  }

  @Get()
  @ApiOperation({
    summary: '파일 단일 다운로드',
    description: '파일을 단일 다운로드합니다.',
  })
  @ApiQuery({
    name: 'folder_name',
    description: '폴더명',
    required: true,
    example: 'test',
  })
  @ApiQuery({
    name: 'file_name',
    description: '파일명',
    required: true,
    example: '5qveGKaBEpKbQUe3qMSwSU.png',
  })
  @ApiQuery({
    name: 'original_name',
    description: '파일 원본명',
    required: true,
    example: 'test.png',
  })
  @CustomApiResponse(PostPutSuccessDto)
  async downloadFile(
    @Query('folder_name') folder_name = 'images',
    @Query('file_name') file_name: string,
    @Query('original_name') original_name: string,
    @Res() res: Response,
  ) {
    return await this.fileUploadService.downloadFile(
      `${folder_name}/${file_name}`,
      original_name,
      res,
    );
  }
}
