import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../infrastructure/entities/subscription.entity';
import { SubscriptionsController } from './controllers/subscription/subscription.controller';
import { SubscriptionService } from '../core/services/subscription/subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
