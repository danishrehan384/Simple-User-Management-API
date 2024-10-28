import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Database/Entities/user.entity';
import { LocalStrategy } from './Strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './Strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_config: ConfigService) => ({
        secret: _config.get('JWT_KEY'),
        signOptions: {
          expiresIn: _config.get('JWT_EXPIRES') + 's'
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy]
})
export class AuthModule { }
