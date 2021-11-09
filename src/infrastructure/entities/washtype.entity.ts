import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from './company.entity';
import { CompanyModel } from '../../core/models/company.model';

@Entity({ name: 'WashType' })
export class WashtypeEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public price: number;

  @ManyToOne(() => CompanyEntity)
  @JoinColumn()
  public company: CompanyModel;
}
