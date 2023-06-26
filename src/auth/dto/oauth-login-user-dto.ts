import { IsEmail, IsString, MinLength } from 'class-validator';

export class OAuthLoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  fullName: string;
}
