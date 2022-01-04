import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication/authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from 'src/core/services/authentication/web/authentication.service';
import { CompanyModule } from './company.module';
import { LocalStrategy } from 'src/core/authentication/web/strategies/local.strategy';
import { JwtStrategy } from 'src/core/authentication/web/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from 'src/core/authentication/web/strategies/jwt-refresh-token.strategy';

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
