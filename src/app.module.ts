import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FoodModule } from './modules/food/food.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, FoodModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
