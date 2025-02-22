import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { TUserAccount } from 'src/common/types/types';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

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

  async register(registerDto: RegisterDto) {
    const { email, password, first_name, last_name, account, phone_number } =
      registerDto;

    const userExists = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (userExists) throw new BadGatewayException(`Email existed!`);

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

    return userNew;
  }
}
