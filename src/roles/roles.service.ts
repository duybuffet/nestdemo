import { Injectable, Logger } from '@nestjs/common';
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
    return await this.roleRepository.findOne(id);
  }

  async create(role: any): Promise<Role> {
    this.logger.log('Creating role');
    return await this.roleRepository.save(role);
  }

  async update(id: number, role: any): Promise<UpdateResult> {
    this.logger.log('Updating role');
    return await this.roleRepository.update(id, role);
  }

  async delete(id: number): Promise<DeleteResult> {
    this.logger.log('Deleting role');
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
}
