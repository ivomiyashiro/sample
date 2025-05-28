import { PaginatedResult } from '@/common/dtos/pagination.dto';
import { SampleDTO } from './sample.dto';

export type PaginatedSampleDTO = PaginatedResult<SampleDTO>;
