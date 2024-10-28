import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwt: JwtService) { }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async Login(@Body() loginDto: LoginDto, @Request() req) {
    return {
      token: this.jwt.sign(req.user)
    }
  }
}
