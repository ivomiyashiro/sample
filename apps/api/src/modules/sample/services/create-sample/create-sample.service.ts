import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSampleDTO } from '@sample/shared';

import { AppErrorType, Result } from '@/utils';
import { DatabaseService } from '@/common/services/database/database.module';
import { StorageSupabaseService } from '@/common/services/supabase/services/storage-supabase.service';

import { SampleDTO } from '../../dtos';
import { createSampleValidator } from './create-sample.validator';

@Injectable()
export class CreateSampleService {
  constructor(
    private readonly prismaService: DatabaseService,
    private readonly storageSupabaseService: StorageSupabaseService,
  ) {}

  async handler(
    dto: CreateSampleDTO,
  ): Promise<Result<SampleDTO, AppErrorType>> {
    const validationResult = createSampleValidator.safeParse(dto);

    if (!validationResult.success) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const existingSample = await this.prismaService.sample.findFirst({
      where: {
        name: validationResult.data.name,
      },
    });

    if (existingSample) {
      return Result.failure({
        type: HttpStatus.CONFLICT,
        message: `Sample with name "${validationResult.data.name}" already exists`,
        details: {
          name: ['Sample already exists'],
        },
      });
    }

    let imageUrl: string | null = null;
    if (validationResult.data.image) {
      const result = await this.storageSupabaseService.upload('samples', {
        base64: validationResult.data.image.base64,
        name: validationResult.data.image.fileName,
        extension: validationResult.data.image.extension,
        mimeType: validationResult.data.image.mimeType,
      });

      if (result.isFailure) {
        return Result.failure({
          type: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to upload image',
          details: {
            imageUrl: ['Failed to upload image'],
          },
        });
      }

      imageUrl = result.value;
    }

    const sample = await this.prismaService.sample.create({
      data: {
        name: validationResult.data.name,
        description: validationResult.data.description ?? null,
        imageUrl,
      },
    });

    return Result.success(sample);
  }
}
