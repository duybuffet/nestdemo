import { Controller, Get, Post, Put, Delete, Param, Body, DefaultValuePipe, ParseIntPipe, Query, ParseArrayPipe, ValidationPipe, UseInterceptors, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseInterceptors(TransformInterceptor)
@UseGuards(RolesGuard)
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
  @Roles('admin')
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
  @ApiBody({
    description: "The Description for the Post Body.",
    examples: {
      default: {
        value: {
          user: {
            "firstname": "string",
            "lastname": "string",
            "email": "string@string.com",
            "age": 20
          },
          roles: [{
            "id": 0
          }]
        }
      }
    }
  })
  create(
    @Body('user') userDto: CreateUserDto,
    @Body('roles', new ParseArrayPipe({ items: CreateRoleDto })) rolesDto: CreateRoleDto[]
  ): any {
    return this.usersService.create(userDto, rolesDto);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiBody({
    description: "The Description for the Put Body.",
    examples: {
      default: {
        value: {
          user: {
            "firstname": "string",
            "lastname": "string",
            "age": 20
          },
          roles: [{
            "id": 0,
            "delete": true
          }]
        }
      }
    }
  })
  update(@Param(
    'id', ParseIntPipe) id,
    @Body('user', new ValidationPipe({ skipUndefinedProperties: true, forbidNonWhitelisted: false })) userDto: UpdateUserDto,
    @Body('roles', new ParseArrayPipe({ items: UpdateRoleDto })) rolesDto: UpdateRoleDto[]
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
