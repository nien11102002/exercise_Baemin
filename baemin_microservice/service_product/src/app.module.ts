import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisCacheModule } from './redis_cache/redis_cache.module';
import { ElasticModule } from './elastic/elastic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisCacheModule,
    ElasticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
