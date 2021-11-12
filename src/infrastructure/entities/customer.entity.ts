import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionModel } from '../../core/models/subscription.model';
import { LicenseplateEntity } from './licenseplate.entity';
import { LicenseplateModel } from '../../core/models/licenseplate.model';

@Entity({ name: 'Customer' })
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public passwordHash: string;

  @Column()
  public passwordSalt: string;

  @Column()
  public creationDate: Date;

  @Column()
  public phoneNumber: string;

  @ManyToOne(() => SubscriptionEntity)
  @JoinColumn()
  public subscription: SubscriptionModel;

  @OneToMany(() => LicenseplateEntity, (lp: LicenseplateEntity) => lp.customer)
  public licensePlates: LicenseplateModel[];

  @Column()
  public active: boolean;
}
