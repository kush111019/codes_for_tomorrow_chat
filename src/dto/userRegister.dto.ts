
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEmail({}, { message: 'Invalid email' })
  email!: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}
