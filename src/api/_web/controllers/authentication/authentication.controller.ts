import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthenticationService } from 'src/core/services/authentication/web/authentication.service';
import { CreateCompanyDto } from 'src/api/dtos/create-company.dto';
import RequestWithCompany from 'src/core/authentication/web/request-with-company.interface';
import { CompanyService } from 'src/core/services/company/company.service';
import { WebLocalAuthenticationGuard } from 'src/core/authentication/web/guards/local-auth.guard';
import JwtAuthenticationGuard from 'src/core/authentication/web/guards/jwt-auth.guard';
import JwtRefreshGuard from 'src/core/authentication/web/guards/jwt-refresh-auth.guard';

@Controller('web/authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly companyService: CompanyService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: CreateCompanyDto) {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(WebLocalAuthenticationGuard)
  @HttpCode(200)
  @Post('log-in')
  async logIn(@Req() request: RequestWithCompany) {

    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const {
      cookie: refreshTokenCookie,
      token: refreshToken
    } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.companyService.setCurrentRefreshToken(refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return user;
  }

  @Post('log-out')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: RequestWithCompany) {
    await this.companyService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
  }

  // get logged in user
  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  authenticate(@Req() request: RequestWithCompany) {
    const company = request.user;
    company.password = undefined;
    return company;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() request: RequestWithCompany) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
