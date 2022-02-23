import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';
import * as mongoose from 'mongoose';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Username for account' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Password for account' })
  password: string;
}
export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Username for account' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Username for account' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Password for account' })
  password: string;
}
export interface ObjectId {
  _id: mongoose.ObjectId;
}
export interface UserResponse {
  username: string;
}

export interface AuthResponse {
  token: string;
}
export interface RegisterResponse {
  createdAt: string;
  email: string;
  name: string;
  role: string;
  _id: string;
}
