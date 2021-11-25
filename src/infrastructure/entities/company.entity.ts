import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({nullable: true})
  //@Exclude()    to be used with class-transformer package
  public currentHashedRefreshToken?: string;

  @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })  
  public creationDate: Date;

  @Column()
  public phoneNumber: string;
}