import { Controller, Get, Param } from '@nestjs/common';
import { SubscriptionService } from '../../../core/services/subscription/subscription.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NumberStringParam } from '../../utilities/numberstringparam';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private service: SubscriptionService) {
  }

  @Get()
  @ApiOperation({summary: 'Get subscription with the name Abonnement'})
  @ApiOkResponse({description: 'Subscription with specified name returned'})
  @ApiNotFoundResponse({ description: 'Subscription not found' })
  async getSubscription() {
    return await this.service.getSubscription();
  }
}
