import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/role.entity';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstname: string;

  @ApiProperty()
  @Column()
  lastname: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  age: number;

  @ApiProperty()
  @CreateDateColumn()
  created!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated!: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt?: Date;
  
  @ManyToMany(type => Role, role => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id'},
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id'},
  })
  roles?: Role[];
}
