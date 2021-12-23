import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  firstname: string;

  @ApiProperty()
  @IsOptional()
  lastname: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  age: string;
}