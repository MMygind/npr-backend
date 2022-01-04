import { Controller, Get, UseGuards } from '@nestjs/common';
import { SubscriptionService } from '../../../../core/services/subscription/subscription.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../../../../core/authentication/mobile/guards/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private service: SubscriptionService) {
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({summary: 'Get subscription with the name Abonnement'})
  @ApiOkResponse({description: 'Subscription with specified name returned'})
  @ApiNotFoundResponse({ description: 'Subscription not found' })
  async getSubscription() {
    return await this.service.getSubscription();
  }
}
