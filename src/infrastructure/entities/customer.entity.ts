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
import { LicensePlateEntity } from './licenseplate.entity';
import { LicensePlateModel } from '../../core/models/licenseplate.model';
import { Exclude } from 'class-transformer';
import { CompanyEntity } from './company.entity';
import { CompanyModel } from '../../core/models/company.model';

@Entity({ name: 'Customer' })
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ nullable: true })
  @Exclude() // to be used stripped in controller by class-transformer package
  public currentHashedRefreshToken?: string;

  @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  public creationDate: Date;

  @Column()
  public phoneNumber: string;

  @ManyToOne(() => SubscriptionEntity)
  @JoinColumn()
  public subscription: SubscriptionModel;

  @OneToMany(() => LicensePlateEntity, (lp: LicensePlateEntity) => lp.customer)
  public licensePlates: LicensePlateModel[];

  @Column({ type: "int", nullable: true })
  companyId: number;

  @ManyToOne(() => CompanyEntity, (company: CompanyEntity) => company.customers)
  @JoinColumn()
  public company: CompanyModel;

  @Column()
  public active: boolean;
}
