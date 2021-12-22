import { Controller, Get, Post, Put, Delete, Param, Body, DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @ApiOkResponse({
    type: Role,
    isArray: true
  })
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Role>> {
    limit = limit > 25 ? 25 : limit;
    return this.rolesService.paginate({
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    type: Role,
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number'
  })
  show(@Param('id') id): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Role,
  })
  create(@Body() role: Role): Promise<Role> {
    return this.rolesService.create(role);
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
  update(@Param('id') id: number, @Body() role: Role): Promise<any> {
    role.id = id;
    return this.rolesService.update(role);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number'
  })
  delete(@Param('id') id): Promise<any> {
    return this.rolesService.delete(id);
  }
}
