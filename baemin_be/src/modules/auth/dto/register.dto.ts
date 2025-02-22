import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: `Email is not validation` })
  email: string;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsString()
  account: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  repassword: string;
}
