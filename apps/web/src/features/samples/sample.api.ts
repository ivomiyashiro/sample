import type {
  ErrorResponse,
  PaginatedQueryParams,
  PaginatedResponse,
  SampleDTO,
  SuccessResponse,
} from '@sample/shared';

import type { ApiPaginatedResult, ApiResult } from '@/lib/api';
import { BaseApiService } from '@/lib/api';
import { Result } from '@/lib/utils';

class SampleApi extends BaseApiService {
  public async getPaginatedSamples({
    params,
  }: {
    params?: PaginatedQueryParams;
  }): Promise<ApiPaginatedResult<SampleDTO>> {
    try {
      const result = await this.get<PaginatedResponse<SampleDTO>>('/samples', {
        params,
      });

      return Result.success(result);
    } catch (error) {
      return Result.failure(error as ErrorResponse);
    }
  }

  public async createSample(data: SampleDTO): Promise<ApiResult<SampleDTO>> {
    try {
      const result = await this.post<SuccessResponse<SampleDTO>>(
        '/samples',
        data,
      );

      return Result.success(result);
    } catch (error) {
      return Result.failure(error as ErrorResponse);
    }
  }
}

const sampleApi = new SampleApi();

export default sampleApi;
