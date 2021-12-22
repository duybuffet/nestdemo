import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsNumber, IsOptional, ValidateNested } from 'class-validator';


export class RoleDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  delete: boolean;
}
