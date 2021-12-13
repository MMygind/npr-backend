import Role from '../../core/authentication/web/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { LocationEntity } from './location.entity';
import { LocationModel } from 'src/core/models/location.model';

@Entity({ name: 'Company' })
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  public password: string;

  @Column({ nullable: true })
  @Exclude() // to be used stripped in controller by class-transformer package
  public currentHashedRefreshToken?: string;

  @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  public creationDate: Date;

  @Column()
  public phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  public role: Role

  @OneToMany(
    () => LocationEntity, (location: LocationEntity) => location.company)
  public locations: LocationModel[];
}
