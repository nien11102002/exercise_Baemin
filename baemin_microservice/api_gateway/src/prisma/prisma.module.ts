import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({})
export class PrismaModule {
  export: [PrismaService];
  provider: [PrismaService];
}
