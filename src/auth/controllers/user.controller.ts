import { Body, Controller, Get, Post } from '@nestjs/common';
import { EAllowedPermissions } from '../constants';
import { AuthWithPermissions } from '../decorators/authWithPermissions.decorator';
import { GetUser } from '../decorators/get-user.decorator';
import { CreateUserDto } from '../dto';
import { IAuthUser } from '../interfaces';
import { UserService } from '../services';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @AuthWithPermissions({
    strategy: 'matchAll',
    permissions: [EAllowedPermissions.CreateUser],
  })
  create(@Body() createUserDto: CreateUserDto, @GetUser() user: IAuthUser) {
    return this.userService.create(createUserDto, user);
  }
}
