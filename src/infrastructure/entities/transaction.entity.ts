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
import { LicenseplateEntity } from './licenseplate.entity';
import { LicenseplateModel } from '../../core/models/licenseplate.model';

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

  @ManyToOne(() => LicenseplateEntity)
  @JoinColumn()
  public licensePlate: LicenseplateModel;

  @Column()
  public purchasePrice: number;

  @Column()
  public timestamp: Date;

  @Column()
  public imageURL: string;
}
