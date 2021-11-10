import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionModel } from '../../models/transaction.model';
import { CustomerService } from '../customer/customer.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private customerService: CustomerService,
    private companyService: CompanyService,
  ) {}

  async getAllTransactions(): Promise<TransactionModel[]> {
    const transactions = await this.transactionRepository.find({
      relations: ['washType', 'location', 'licensePlate'],
    });
    const transactionEntities: TransactionModel[] = JSON.parse(
      JSON.stringify(transactions),
    );
    return transactionEntities;

  async getTransactionById(id: number): Promise<TransactionModel> {
    const transaction = await this.transactionRepository.findOne(id, {
      relations: [
        'washType',
        'location',
        'location.company',
        'licensePlate',
        'licensePlate.customer',
        'licensePlate.customer.subscription',
      ],
    });
    transaction.location.company =
      this.companyService.getCompanyWithoutPassword(
        transaction.location.company,
      );
    transaction.licensePlate.customer =
      this.customerService.getCustomerWithoutPassword(
        transaction.licensePlate.customer,
      );
    return transaction;
  }
}
