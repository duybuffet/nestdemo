import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

@Entity('roles')
export class Role {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @CreateDateColumn()
  created!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated!: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToMany(type => User, user => user.roles)
  users?: User[];
}
