import {
  BadGatewayException,
  BadRequestException,
  Controller,
  Get,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { TUserAccount } from 'types/type';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @MessagePattern('login')
  async login(@Payload() data) {
    const { identifier, password } = data;

    const userExists = await this.prisma.users.findFirst({
      where: {
        OR: [
          { account: identifier },
          { email: identifier },
          { phone_number: identifier },
        ],
      },
      select: {
        id: true,
        password: true,
      },
    });
    if (!userExists)
      throw new BadRequestException('User not exist, please register!');

    const passHash = userExists.password;
    const isPassword = bcrypt.compareSync(password, passHash);
    if (!isPassword)
      throw new BadRequestException(`Password or email is not corrected`);

    const tokens = this.createTokens(userExists);

    return tokens;
  }

  createTokens(userExists: TUserAccount) {
    const accessToken = this.jwtService.sign(
      { user_id: userExists.id },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { user_id: userExists.id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
      },
    );

    return { accessToken, refreshToken };
  }

  @MessagePattern('register')
  async register(@Payload() data) {
    const {
      email,
      password,
      first_name,
      last_name,
      account,
      phone_number,
      repassword,
    } = data;

    var userExists = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email: email },
          { phone_number: phone_number },
          { account: account },
        ],
      },
    });
    if (userExists) throw new BadGatewayException(`Account existed!`);

    if (password !== repassword)
      throw new BadGatewayException('Not similar password');

    const hashPassword = bcrypt.hashSync(password, 10);

    const userNew = await this.prisma.users.create({
      data: {
        email: email,
        account: account,
        first_name: first_name,
        last_name: last_name,
        password: hashPassword,
        phone_number: phone_number,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        account: true,
        phone_number: true,
        email: true,
      },
    });

    //await mailSender(email);

    const tokens = this.createTokens(userNew);

    return { tokens, userNew };
  }
}
