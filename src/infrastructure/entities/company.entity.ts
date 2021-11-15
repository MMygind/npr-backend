import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { LocationEntity } from './location.entity';
import { LocationModel } from '../../core/models/location.model';

@Entity({ name: 'Company' })
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

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

  @OneToMany(
    () => LocationEntity,
    (location: LocationEntity) => location.company,
  )
  public locations: LocationModel[];
}
