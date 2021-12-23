import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';


export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty()
  delete: boolean;
}
