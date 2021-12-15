import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WashTypeEntity } from './washtype.entity';
import { WashTypeModel } from '../../core/models/washtype.model';
import { LocationEntity } from './location.entity';
import { LocationModel } from '../../core/models/location.model';
import { LicensePlateEntity } from './licenseplate.entity';
import { LicensePlateModel } from '../../core/models/licenseplate.model';

@Entity({ name: 'Transaction' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => WashTypeEntity)
  @JoinColumn()
  public washType: WashTypeModel;

  @ManyToOne(() => LocationEntity)
  @JoinColumn()
  public location: LocationModel;

  @ManyToOne(() => LicensePlateEntity, { nullable: true })
  @JoinColumn()
  public licensePlate?: LicensePlateModel;

  @Column()
  public purchasePrice: number;

  @Column()
  public timestamp: Date;

  @Column({ nullable: true })
  public imageURL?: string;
}
