import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  index(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  show(@Param('id') id): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Post()
  create(@Body() role: Role): Promise<Role> {
    return this.rolesService.create(role);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() role: Role): Promise<any> {
    role.id = id;
    return this.rolesService.update(role);
  }

  @Delete(':id')
  delete(@Param('id') id): Promise<any> {
    return this.rolesService.delete(id);
  }
}
