import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthenticationService } from 'src/core/services/authentication/authentication.service';
import { LocalAuthenticationGuard } from 'src/core/authentication/localAuthenticationGuard';
import CreateCompanyDto from 'src/core/dtos/createCompany.dto';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';
import RequestWithCompany from 'src/core/authentication/requestWithCompany.interface';
import { CompanyService } from 'src/core/services/company/company.service';
import JwtRefreshGuard from 'src/core/authentication/jwtRefresh.guard';
import { AuthGuard } from '@nestjs/passport';
 
@Controller('authentication')
//@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly companyService: CompanyService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: CreateCompanyDto) {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(LocalAuthenticationGuard)
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

  // get logged in user - NOT NEEDED () if user is returned in reposnse body at login
  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  authenticate(@Req() request: RequestWithCompany) {
    const company = request.user;
    company.password = undefined;
    return company;
  }

  //@UseGuards(JwtRefreshGuard)
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Post('refresh')
  refresh(@Req() request: RequestWithCompany) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}