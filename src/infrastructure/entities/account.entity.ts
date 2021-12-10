import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerModel } from '../../core/models/customer.model';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'Account' })
export class AccountEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public balance: number;

  @OneToOne(() => CustomerEntity)
  @JoinColumn()
  public customer: CustomerModel;
}
