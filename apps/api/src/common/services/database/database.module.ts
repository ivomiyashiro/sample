import { Global, Module, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
