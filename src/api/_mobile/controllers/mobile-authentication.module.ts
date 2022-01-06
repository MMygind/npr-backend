import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MobileAuthenticationService } from 'src/core/services/authentication/mobile/authentication.service';
import { LocalStrategy } from 'src/core/authentication/mobile/strategies/local.strategy';
import { JwtStrategy } from 'src/core/authentication/mobile/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from 'src/core/authentication/mobile/strategies/jwt-refresh-token.strategy';
import { MobileAuthenticationController } from './authentication/mobile-authentication.controller';
import { MobileCustomerModule } from './mobile-customer.module';
 
@Module({
  imports: [
    MobileCustomerModule,
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
  providers: [MobileAuthenticationService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [MobileAuthenticationController],
  exports: [MobileAuthenticationService]
})
export class MobileAuthenticationModule {}