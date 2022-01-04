import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { MobileAuthenticationService } from 'src/core/services/authentication/mobile/authentication.service';
import { MobileLocalAuthenticationGuard } from 'src/core/authentication/mobile/guards/local-auth.guard';
import JwtAuthenticationGuard from 'src/core/authentication/mobile/guards/jwt-auth.guard';
import { CustomerService } from 'src/core/services/customer/customer.service';
import RequestWithCustomer from 'src/core/authentication/mobile/request-with-customer.interface';
import JwtRefreshGuard from 'src/core/authentication/mobile/guards/jwt-refresh-auth.guard';
import CreateCustomerDto from '../../../dtos/create-customer.dto';

@Controller('mobile/authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class MobileAuthenticationController {
  constructor(
    private readonly authenticationService: MobileAuthenticationService,
    private readonly customerService: CustomerService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: CreateCustomerDto) {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(MobileLocalAuthenticationGuard)
  @HttpCode(200)
  @Post('log-in')
  async logIn(@Req() request: RequestWithCustomer) {
    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const {
      cookie: refreshTokenCookie,
      token: refreshToken
    } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.customerService.setCurrentRefreshToken(refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return user;
  }

  @Post('log-out')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: RequestWithCustomer) {
    await this.customerService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
  }

  // get logged in user
  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  authenticate(@Req() request: RequestWithCustomer) {
    const customer = request.user;
    customer.password = undefined;
    return customer;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() request: RequestWithCustomer) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
  
}
