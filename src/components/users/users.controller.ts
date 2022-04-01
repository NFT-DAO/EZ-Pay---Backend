import {
  Body,
  Controller,
  Logger,
  Post,
  Get,
  Req,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO, RegisterDTO } from './dto/users.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /**
   * Registration
   * @param req
   */
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Req() req, @Body() RegisterDTO: RegisterDTO) {
    Logger.log(RegisterDTO);
    return this.userService.createUser(RegisterDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req) {
    return req.user;
  }
}
