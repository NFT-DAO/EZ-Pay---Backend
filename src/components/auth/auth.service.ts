import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDTO, AuthResponse } from '../users/dto/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginDTO): Promise<any> {
    const user = await this.usersService.findByPayload({ email, password });
    if (user) {
      // && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDTO: LoginDTO): Promise<AuthResponse> {
    try {
      const user = await this.usersService.findByLogin(loginDTO);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = {
        user_id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        exp: new Date().setMinutes(60) / 1000,
      };
      const token = this.jwtService.sign(payload);
      return {
        token,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
