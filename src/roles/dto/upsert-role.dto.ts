import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
