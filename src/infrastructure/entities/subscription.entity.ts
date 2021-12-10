import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Subscription' })
export class SubscriptionEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}
