import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService
  ) {}
  
  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne(id, { withDeleted: true, relations: ['roles'] });
  }

  async create(user: any, roles: any): Promise<User> {
    let isAllRolesExist = await this.rolesService.isAllExists(roles.map(r => r.id));
    if (!isAllRolesExist) {
      throw new BadRequestException('Some role is not existed');
    }
    user.roles = roles;
    return await this.userRepository.save(user);
  }

  async update(id: number, user: any): Promise<UpdateResult> {
    return await this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.softDelete(id);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('u');
    queryBuilder.orderBy('u.id', 'ASC')
                .leftJoinAndSelect('u.roles', 'role');

    return paginate<User>(queryBuilder, options);
  }
}
