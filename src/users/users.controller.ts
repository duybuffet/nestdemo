import { Controller, Get, Post, Put, Delete, Param, Body, DefaultValuePipe, ParseIntPipe, Query, ParseArrayPipe, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RoleDto } from './dto/role.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    type: User,
    isArray: true
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false
  })
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<User>> {
    limit = limit > 25 ? 25 : limit;
    return this.usersService.paginate({
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    type: User,
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number'
  })
  show(@Param('id', ParseIntPipe) id): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  create(@Body('user') userDto: CreateUserDto, @Body('roles', new ParseArrayPipe({ items: RoleDto })) rolesDto: RoleDto[]): any {
    return this.usersService.create(userDto, rolesDto);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number'
  })
  @ApiResponse({
    status: 200
  })
  update(@Param(
    'id', ParseIntPipe) id,
    @Body('user', new ValidationPipe({ skipUndefinedProperties: true, forbidNonWhitelisted: false })) userDto: UpdateUserDto,
    @Body('roles', new ParseArrayPipe({ items: RoleDto })) rolesDto: RoleDto[]
  ): Promise<any> {
    return this.usersService.update(id, userDto, rolesDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number'
  })
  delete(@Param('id', ParseIntPipe) id): Promise<any> {
    return this.usersService.delete(id);
  }
}
