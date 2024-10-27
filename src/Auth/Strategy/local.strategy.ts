import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { User } from 'src/Database/Entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly _userRepo: Repository<User>,
  ) {
    super({
      usernameField: 'email',
      paswordField: 'password',
    });
  }

  async validate(email: string, password: string) {

    try {
      const isUserExist: User = await this._userRepo.findOne({
        where: {
          email: email,
          deleted_at: IsNull(),
        },
      });
  
      if (!isUserExist) throw new UnauthorizedException('Invalid Email Address');
  
      const hashPassword = isUserExist.password;
      const decryptPass = await bcrypt.compare(password, hashPassword);
  
      if (!decryptPass) throw new UnauthorizedException('Invalid Password');
  
      const payload: any = {
        id: isUserExist.id,
        name: isUserExist.name,
        email: isUserExist.email,
        role: isUserExist.role
      };
  
      return payload;
      
    } catch (error) {
        throw new HttpException(error.message, error.status);
    }

  }
}
