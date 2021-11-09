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
  public passwordHash: string;

  @Column()
  public passwordSalt: string;

  @Column()
  public creationDate: Date;

  @Column()
  public phoneNumber: string;
}
