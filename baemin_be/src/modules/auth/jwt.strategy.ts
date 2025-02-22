import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TUser } from 'src/common/types/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, `protect`) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    // console.log(`validate`);
    // console.log({ payload });
    const user: TUser = await this.prisma.users.findUnique({
      where: { id: Number(payload.user_id) },
      select: {
        account: true,
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
      },
    });

    // console.log(user);
    return user;
  }
}
