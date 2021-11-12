import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WashtypeEntity } from './washtype.entity';
import { WashtypeModel } from '../../core/models/washtype.model';
import { LocationEntity } from './location.entity';
import { LocationModel } from '../../core/models/location.model';
import { LicenseplateEntity } from './licenseplate.entity';
import { LicenseplateModel } from '../../core/models/licenseplate.model';

@Entity({ name: 'Transaction' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => WashtypeEntity)
  @JoinColumn()
  public washType: WashtypeModel;

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
