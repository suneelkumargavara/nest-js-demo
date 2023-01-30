import { Controller, NotFoundException, UseGuards } from '@nestjs/common';
import { Post, Get, Patch, Delete } from '@nestjs/common';
import { Param, Body, Query } from '@nestjs/common';
import { Session } from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';

import { Serialize } from '../interceprots/serialize.interceptor';

import { CurrentUser } from './decorators/currentuser.decorator';

import { AuthGuard } from '../guards/auth.guard';

import { UserDTO } from './dtos/user.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: any) {
    console.log(`User got from who am i is ${user}`);
    return user;
  }

  @Post('/signUp')
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(Number(id));
    if (!user) throw new NotFoundException();
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    const intId = parseInt(id);
    return this.userService.remove(intId);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.userService.update(parseInt(id), body);
  }
}
