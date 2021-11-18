import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get } from '@nestjs/common';
import { AuthenticationService } from 'src/core/services/authentication/authentication.service';
import { LocalAuthenticationGuard } from 'src/core/authentication/localAuthenticationGuard';
import CreateCompanyDto from 'src/core/dtos/createCompany.dto';
import JwtAuthenticationGuard from 'src/core/authentication/jwt-authentication.guard';
import RequestWithCompany from 'src/core/authentication/requestWithCompany.interface';
 
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: CreateCompanyDto) {
    return this.authenticationService.register(registrationData);
  }
 
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithCompany) {
    const {company} = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(company.id);
    request.res.setHeader('Set-Cookie', cookie);
    company.password = undefined;
    return request.res.send(company);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithCompany) {
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithCompany) {
    const company = request.company;
    company.password = undefined;
    return company;
  }
}