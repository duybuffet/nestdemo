import { Controller, Get, Post, Put, Delete, Param, Body, DefaultValuePipe, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UpsertRoleDto } from './dto/upsert-role.dto';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
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
  show(@Param('id', new ParseIntPipe()) id): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Role,
  })
  @UsePipes(new ValidationPipe())
  create(@Body() roleDto: UpsertRoleDto): Promise<Role> {
    return this.rolesService.create(roleDto);
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
  @UsePipes(new ValidationPipe())
  update(@Param('id', new ParseIntPipe()) id, @Body() roleDto: UpsertRoleDto): Promise<any> {
    return this.rolesService.update(id, roleDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number'
  })
  delete(@Param('id', new ParseIntPipe()) id): Promise<any> {
    return this.rolesService.delete(id);
  }
}
