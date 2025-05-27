import { PaginatedResult } from '@/dtos/pagination.dto';
import { SampleDTO } from './sample.dto';

export type PaginatedSampleDTO = PaginatedResult<SampleDTO>;
