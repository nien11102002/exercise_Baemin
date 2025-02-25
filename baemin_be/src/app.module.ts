import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FoodModule } from './modules/food/food.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CheckoutModule } from './modules/checkout/checkout.module';

@Module({
  imports: [
    AuthModule,
    FoodModule,
    ConfigModule.forRoot({ isGlobal: true }),
    OrderModule,
    CartModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/images',
    }),
    CheckoutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
