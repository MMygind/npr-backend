import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomerService } from '../../customer/customer.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from 'src/api/dtos/create-customer.dto';
import TokenPayload from 'src/core/authentication/mobile/token-payload.interface';

@Injectable()
export class MobileAuthenticationService {
    constructor(
        private readonly customerService: CustomerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async register(registrationData: CreateCustomerDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdCustomer = await this.customerService.create({
                ...registrationData,
                password: hashedPassword
            });
            createdCustomer.password = undefined; // not elegant way of stripping password from entity. Todo use DTO
            return createdCustomer;
        } catch (error) {
            if (error?.code === "23505") { // unique key constraint for Postgres
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAuthenticatedCustomer(email: string, plainTextPassword: string) {
        try {
            const customer = await this.customerService.getByEmail(email);

            await this.verifyPassword(plainTextPassword, customer.password);
            customer.password = undefined;
            return customer;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieWithJwtAccessToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }

    // change path to /authentication/refresh?
    public getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        return {
            cookie,
            token
        }
    }

    public getCookiesForLogOut() {
        return [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0'
        ];
    }
}
