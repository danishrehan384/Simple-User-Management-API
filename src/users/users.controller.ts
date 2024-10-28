import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/Auth/Guards/role.guard';
import { UserRoles } from 'utils/roles.enum';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiSecurity('JWT_auth')
  @Get()
  @UseGuards(new RoleGuard(UserRoles.ADMIN))
  findAll(@Request() req) {
    return this.usersService.findAll();
  }

  @ApiSecurity('JWT_auth')
  @Get('details')
  findUserDetails(@Request() req){
    return this.usersService.findById(req.user.id);
  }

  @ApiSecurity('JWT_auth')
  @Get(':id')
  @UseGuards(new RoleGuard(UserRoles.ADMIN))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @ApiSecurity('JWT_auth')
  @Patch(':id')
  @UseGuards(new RoleGuard(UserRoles.ADMIN))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiSecurity('JWT_auth')
  @Delete(':id')
  @UseGuards(new RoleGuard(UserRoles.ADMIN))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
