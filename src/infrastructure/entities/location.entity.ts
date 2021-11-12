import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from './company.entity';
import { CompanyModel } from '../../core/models/company.model';
import { WashTypeEntity } from './washtype.entity';
import { WashTypeModel } from '../../core/models/washtype.model';

@Entity({ name: 'Location' })
export class LocationEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(() => CompanyEntity)
  @JoinColumn()
  public company: CompanyModel;

  @Column()
  public address: string;

  @Column()
  public postalCode: number;

  @Column()
  public city: string;

  @Column({ nullable: true })
  public latitude?: number;

  @Column({ nullable: true })
  public longitude?: number;

  @ManyToMany(() => WashTypeEntity)
  @JoinTable({ name: 'LocationWashType' })
  public washTypes: WashTypeModel[];
}
