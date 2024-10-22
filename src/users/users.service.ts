import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Database/Entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly _userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, name, password } = createUserDto;

      const isUserAlreadyExist = await this._userRepo.findOne({
        where: {
          email,
        },
      });

      if (isUserAlreadyExist)
        throw new BadRequestException('This email is already exist');

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const userPayload = {
        name: name,
        email: email,
        password: hashPassword,
      };

      const create = this._userRepo.create(userPayload);
      return await this._userRepo.save(create);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    return await this._userRepo.find({
      where: {
        deleted_at: IsNull(),
      },
    });
  }

  async findOne(id: number) {
    try {
      const isUserExist = await this._userRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!isUserExist) throw new NotFoundException('Invalid user id');

      return isUserExist;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const { email, name, password } = updateUserDto;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await this._userRepo
          .createQueryBuilder('user')
          .update()
          .set({
            name: name,
            email: email,
            password: hashPassword,
          })
          .where('id = :id AND deleted_at IS NULL', { id })
          .execute();

        return 'User updated successfully';
      } else {
        await this._userRepo
          .createQueryBuilder('user')
          .update()
          .set({
            name: name,
            email: email,
            password: password,
          })
          .where('id = :id AND deleted_at IS NULL', { id })
          .execute();

        return 'User updated successfully';
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);

      if (user) {
        await this._userRepo
          .createQueryBuilder('user')
          .update()
          .set({
            deleted_at: new Date(),
          })
          .where('id = :id AND deleted_at IS NULL', { id })
          .execute();
      }
      return {
        status: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
