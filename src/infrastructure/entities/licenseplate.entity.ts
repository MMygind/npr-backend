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

  @Column({unique: true})
  public licensePlate: string;

  @ManyToOne(
    () => CustomerEntity,
    (customer: CustomerEntity) => customer.licensePlates,
  )
  @JoinColumn()
  public customer: CustomerModel;
}
