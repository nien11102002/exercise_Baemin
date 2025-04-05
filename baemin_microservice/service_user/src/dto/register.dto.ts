import { IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsEmail({}, { message: `Email is not validation` })
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone_number: string;

  @IsString()
  account: string;

  @IsString()
  password: string;

  @IsString()
  repassword: string;
}
