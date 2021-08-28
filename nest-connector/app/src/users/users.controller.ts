import { Controller, Get, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get('create')
  createUser() {
    this.UsersService.create('user', 'password');
  }
  @Get('getAll')
  getUsers(@Res() res: Response) {
    this.UsersService.findAll(res);
  }
  @Get('del')
  delUser(@Query('id') id) {
    this.UsersService.remove(id);
  }
}
