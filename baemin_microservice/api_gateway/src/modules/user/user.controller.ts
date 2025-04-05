import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class UserController {
  constructor(@Inject('USER_NAME') private userService: ClientProxy) {}

  @Public()
  @Post(`/login`)
  async login(@Body() loginDto: LoginDto) {
    let loginUser = await lastValueFrom(
      this.userService.send('login', loginDto),
    );

    return loginUser;
  }

  @Public()
  @Post(`/register`)
  async register(@Body() registerDto: RegisterDto) {
    let registerUser = await lastValueFrom(
      this.userService.send('register', registerDto),
    );

    return registerUser;
  }
}
