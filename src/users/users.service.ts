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
    let user = await this.userRepository.findOne(id, { withDeleted: true, relations: ['roles'] })
    if (!user) {
      throw new BadRequestException('User is not existed');
    }
    return user;
  }

  async create(user: any, roles: any): Promise<User> {
    await this.checkRolesExist(roles.map(r => r.id));
    user.roles = roles;
    return await this.userRepository.save(user);
  }

  async update(id: number, user: any, roles: any): Promise<User> {
    await this.checkRolesExist(roles.map(r => r.id));
    let existingUser = await this.findOne(id);

    let updateRoles = existingUser.roles;
    let existingRoleIds = updateRoles.map(r => r.id);
    let beDeletedRoleIds = roles.filter(r => r.delete).map(r => r.id);
    updateRoles = updateRoles.filter(r => !beDeletedRoleIds.includes(r.id));
    roles.filter(r => !r.delete).forEach(r => {
      if (!existingRoleIds.includes(r.id)) {
        updateRoles.push(r);
      }
    });
    Object.assign(user, { id, roles: updateRoles })
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.checkUserExist(id);
    return await this.userRepository.softDelete(id);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('u');
    queryBuilder.orderBy('u.id', 'ASC')
                .leftJoinAndSelect('u.roles', 'role');

    return paginate<User>(queryBuilder, options);
  }

  private async checkUserExist(id: number) {
    let isExist = await this.userRepository.count({ id: id }) === 1;
    if (!isExist) {
      throw new BadRequestException('User is not existed');
    }
  }

  private async checkRolesExist(ids: number[]) {
    let isAllRolesExist = await this.rolesService.isAllExists(ids);
    if (!isAllRolesExist) {
      throw new BadRequestException('Some role is not existed');
    }
  }
}
