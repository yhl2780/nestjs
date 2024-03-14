import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { generate } from 'short-uuid';
import { SuccessDto } from '../common/dto/success.dto';
import { isEmpty, throwException } from '../common/util/common.util';
import { Response } from 'express';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly bucketName: string;
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({ region: process.env.S3_REGION });
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  /**
   * 파일명 생성
   * @description {폴더명}/{short-uuid}.{확장자} 형식
   * @param file
   * @param folder
   * @private
   */
  private static getKey(file: Express.Multer.File, folder: string) {
    return [folder, generate() + '.' + file.originalname.split('.')[1]].join(
      '/',
    );
  }

  /**
   * 파일 단일 업로드
   * @param file
   * @param folder
   */
  async uploadFile(
    file: Express.Multer.File,
    folder = 'images',
  ): Promise<SuccessDto> {
    try {
      if (isEmpty(file)) throw new BadRequestException('파일이 없습니다.');
      const key = S3Service.getKey(file, folder);

      const sendData = await this.s3Client
        .send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            ACL: 'public-read',
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        )
        .then((response) => {
          return {
            ETag: response.ETag,
            Location: `https://s3.amazonaws.com/${this.bucketName}/${key}`,
            Key: key,
            key,
            Bucket: this.bucketName,
          };
        });

      return new SuccessDto({ sendData, originalName: file.originalname });
    } catch (e) {
      e.message = `(uploadFile) ${e.message}`;
      throwException(e);
    }
  }

  /**
   * 파일 단일 삭제
   * @param fileName
   */
  async deleteFile(fileName: string): Promise<SuccessDto> {
    try {
      if (isEmpty(fileName))
        throw new BadRequestException('파일명이 없습니다.');

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
        }),
      );

      return new SuccessDto();
    } catch (e) {
      e.message = `(deleteFile) ${e.message}`;
      throwException(e);
    }
  }

  /**
   * 파일 다중 삭제
   * @param fileNames
   */
  async deleteFiles(fileNames: string[]): Promise<SuccessDto> {
    try {
      if (
        isEmpty(fileNames) ||
        (Array.isArray(fileNames) && fileNames.length === 0)
      )
        throw new BadRequestException('파일명이 없습니다.');

      // Promise.all 을 쓰게 되면 실행 순서가 보장되지 않아서 for .. of .. 로 수정
      for (const fileName of fileNames) {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
          }),
        );
      }

      return new SuccessDto();
    } catch (e) {
      e.message = `(deleteFiles) ${e.message}`;
      throwException(e);
    }
  }

  /**
   * 파일 단일 다운로드
   * @param file_name
   * @param original_name
   * @param res
   */
  async downloadFile(file_name: string, original_name: string, res: Response) {
    try {
      const data = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: file_name,
        }),
      );

      if (data.Body instanceof Readable) {
        res
          .setHeader('Content-Type', 'application/octet-stream;')
          .setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURI(original_name)}"`,
          );
        data.Body.pipe(res);
      }

      return new SuccessDto();
    } catch (e) {
      e.message = `(downloadFile) ${e.message}`;
      throwException(e);
    }
  }
}
