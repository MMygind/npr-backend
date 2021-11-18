import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import * as bcrypt from 'bcrypt';
import CreateCompanyDto from 'src/core/dtos/createCompany.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly companyService: CompanyService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async register(registrationData: CreateCompanyDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdCompany = await this.companyService.create({
                ...registrationData,
                password: hashedPassword
            });
            createdCompany.password = undefined; // not elegant way of stripping password from entity. Todo use DTO
            return createdCompany;
        } catch (error) {
            if (error?.code === "23505") { // unique key constraint for Postgres
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            console.log("Error caught (" + error.code + "): " + error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAuthenticatedCompany(email: string, plainTextPassword: string) {
        try {
            const company = await this.companyService.getByEmail(email);


            await this.verifyPassword(plainTextPassword, company.password);
            company.password = undefined;
            console.log("!!! ffs !!!");
            console.log("company: " + JSON.stringify(company));
            return company;
        } catch (error) {
            throw new HttpException('Wrong email provided', HttpStatus.BAD_REQUEST);
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

    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
      }
}
