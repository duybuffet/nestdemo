import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
  
  async findOne(id: number): Promise<Role> {
    return await this.roleRepository.findOne(id);
  }

  async create(role: Role): Promise<Role> {
    this.logger.log('Creating role');
    return await this.roleRepository.save(role);
  }

  async update(role: Role): Promise<UpdateResult> {
    this.logger.log('Updating role');
    return await this.roleRepository.update(role.id, role);
  }

  async delete(id: number): Promise<DeleteResult> {
    this.logger.log('Deleting role');
    return await this.roleRepository.delete(id);
  }
}
