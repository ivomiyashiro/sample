import { HttpStatus, Injectable } from '@nestjs/common';

import { AppErrorType, Result, ResultVoid } from '@/utils';

import { BaseSupabaseService } from './base-supabase.service';

@Injectable()
export class StorageSupabaseService extends BaseSupabaseService {
  constructor() {
    super();
  }

  async upload(
    bucket: string,
    file: {
      base64: string;
      name: string;
      extension: string;
      mimeType: string;
    },
  ): Promise<Result<string, AppErrorType>> {
    const resultBuckets = await this.getBuckets();

    if (resultBuckets.isFailure) {
      return Result.failure({
        type: HttpStatus.INTERNAL_SERVER_ERROR,
        message: resultBuckets.error.message ?? 'Failed to get buckets',
      });
    }

    if (!resultBuckets.value.includes(bucket)) {
      const resultCreateBucket = await this.createPublicBucket(bucket);

      if (resultCreateBucket.isFailure) {
        return Result.failure({
          type: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            resultCreateBucket.error.message ?? 'Failed to create bucket',
        });
      }
    }

    const binaryData = Buffer.from(file.base64, 'base64');
    const { data: uploadData, error } = await this.getAdminClient()
      .storage.from(bucket)
      .upload(
        file.name + file.extension,
        new File([binaryData], file.name + file.extension, {
          type: file.mimeType,
        }),
        { contentType: file.mimeType, upsert: true },
      );

    if (error) {
      return Result.failure({
        type: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        details: {
          file: [error.message],
        },
      });
    }

    const { data: publicUrl } = this.getAdminClient()
      .storage.from(bucket)
      .getPublicUrl(uploadData.path);

    return Result.success(publicUrl.publicUrl);
  }

  async delete(path: string): Promise<ResultVoid<AppErrorType>> {
    const { error } = await this.getAdminClient()
      .storage.from(path)
      .remove([path]);

    if (error) {
      return ResultVoid.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }

    return ResultVoid.success();
  }

  async createPublicBucket(bucket: string): Promise<ResultVoid<AppErrorType>> {
    const { error } = await this.getAdminClient().storage.createBucket(bucket, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    });

    if (error) {
      return ResultVoid.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }

    return ResultVoid.success();
  }

  async getBuckets(): Promise<Result<string[], AppErrorType>> {
    const { data, error } = await this.getAdminClient().storage.listBuckets();
    if (error) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }

    return Result.success(data.map((bucket) => bucket.name));
  }
}
