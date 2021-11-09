import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Administrator' })
export class AdministratorEntity {
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
}
