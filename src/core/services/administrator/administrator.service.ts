import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdministratorEntity } from '../../../infrastructure/entities/administrator.entity';
import { Repository } from 'typeorm';
import { AdministratorModel } from '../../models/administrator.model';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(AdministratorEntity)
    private administratorRepository: Repository<AdministratorEntity>,
  ) {}
}
