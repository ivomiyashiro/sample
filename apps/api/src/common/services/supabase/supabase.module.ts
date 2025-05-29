import { Global, Module } from '@nestjs/common';
import { AuthSupabaseService, StorageSupabaseService } from './services';

@Global()
@Module({
  providers: [StorageSupabaseService, AuthSupabaseService],
  exports: [StorageSupabaseService, AuthSupabaseService],
})
export class SupabaseModule {}
