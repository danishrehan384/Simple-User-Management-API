import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwt: JwtService) { }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async Login(@Request() req) {
    return {
      token: this.jwt.sign(req.user)
    }
  }
}
