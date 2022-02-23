import {
  Body,
  Controller,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDTO } from '../users/dto/users.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiOkResponse({
    status: 200,
    description: 'User authentication successful',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized request',
  })
  @UsePipes(new ValidationPipe())
  @Post('login')
  async authenticate(@Req() req, @Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }
}
