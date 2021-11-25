import { Module } from '@nestjs/common';
import { AuthenticationService } from '../core/services/authentication/authentication.service';
import { CompanyModule } from './company.module';
import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../core/authentication/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/core/authentication/jwt.strategy';
import { JwtRefreshTokenStrategy } from 'src/core/authentication/jwtRefreshToken.strategy';
 
@Module({
  imports: [
    CompanyModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthenticationController],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}