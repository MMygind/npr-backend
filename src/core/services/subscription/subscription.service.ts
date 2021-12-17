import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from '../../../infrastructure/entities/location.entity';
import { Repository } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { SubscriptionEntity } from '../../../infrastructure/entities/subscription.entity';
import { SubscriptionModel } from '../../models/subscription.model';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
  ) {
  }

  async getSubscription(): Promise<SubscriptionModel> {
    const queryBuilder = this.subscriptionRepository
      .createQueryBuilder('subscription');

    queryBuilder.where('subscription.name = :subName', {
      subName: 'Abonnement'
    })

    return queryBuilder.getOne();
  }
}

