import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationEntity } from './location.entity';
import { LocationModel } from '../../core/models/location.model';

@Entity({ name: 'WashType' })
export class WashTypeEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public price: number;

  @ManyToOne(
    () => LocationEntity,
    (location: LocationEntity) => location.washTypes,
  )
  @JoinColumn()
  public location: LocationModel;

  @DeleteDateColumn()
  public deletedAt: Date;
}
