import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionModel } from '../../core/models/subscription.model';
import { Exclude } from 'class-transformer';

@Entity({ name: 'Customer' })
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  @Exclude()
  public passwordHash: string;

  @Column()
  @Exclude()
  public passwordSalt: string;

  @Column()
  public creationDate: Date;

  @Column()
  public phoneNumber: string;

  @ManyToOne(() => SubscriptionEntity)
  @JoinColumn()
  public subscription: SubscriptionModel;

  @Column()
  public active: boolean;
}
