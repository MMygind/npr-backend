import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CustomerModel } from '../../core/models/customer.model';

@Entity({ name: 'LicensePlate' })
export class LicensePlateEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public licensePlate: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn()
  public customer: CustomerModel;
}
