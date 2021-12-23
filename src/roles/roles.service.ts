import { NotFoundException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository, UpdateResult, DeleteResult, In } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  
  async findOne(id: number): Promise<Role> {
    let role = await this.roleRepository.findOne(id)
    if (!role) {
      throw new NotFoundException('Role is not existed');
    }
    return role;
  }

  async create(role: any): Promise<Role> {
    this.logger.log('Creating role');
    return await this.roleRepository.save(role);
  }

  async update(id: number, role: any): Promise<UpdateResult> {
    this.logger.log('Updating role');
    await this.checkRoleExist(id);
    return await this.roleRepository.update(id, role);
  }

  async delete(id: number): Promise<DeleteResult> {
    this.logger.log('Deleting role');
    await this.checkRoleExist(id);
    return await this.roleRepository.softDelete(id);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Role>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('r');
    queryBuilder.orderBy('r.id', 'ASC');

    return paginate<Role>(queryBuilder, options);
  }

  async isAllExists(ids: any[]): Promise<boolean> {
    return await this.roleRepository.count({ id: In(ids) }) === ids.length;
  }

  private async checkRoleExist(id: number) {
    let isExist = await this.roleRepository.count({ id: id }) === 1;
    if (!isExist) {
      throw new NotFoundException('Role is not existed');
    }
  }
}
