import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionModel } from '../../models/transaction.model';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  async getAllTransactions(): Promise<TransactionModel[]> {
    const transactions = await this.transactionRepository.find({
      relations: [
        'washType',
        'location',
        'licensePlate',
        'licensePlate.customer',
        'licensePlate.customer.subscription',
      ],
    });
    const transactionEntities: TransactionModel[] = JSON.parse(
      JSON.stringify(transactions),
    );
    return transactionEntities;
  }

  async paginateTransactions(
    options: IPaginationOptions,
  ): Promise<Pagination<TransactionModel>> {
    return paginate<TransactionModel>(this.transactionRepository, options);
  }

  async getTransaction(id: number): Promise<TransactionModel> {
    if (id >= 0) {
      throw new BadRequestException(
        'Transaction ID must be a positive integer',
      );
    }
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
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
