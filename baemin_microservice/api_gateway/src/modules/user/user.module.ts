import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, JwtStrategy],
})
export class UserModule {}
