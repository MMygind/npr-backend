import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { Brackets, Like, Repository } from 'typeorm';
import { TransactionModel } from '../../models/transaction.model';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  // Denne metode kan måske slettes, men beholdes lige indtil videre
  async getAllTransactions(
    options: IPaginationOptions,
  ): Promise<Pagination<TransactionModel>> {
    const transactions = await paginate<TransactionModel>(
      this.transactionRepository,
      options,
      {
        relations: [
          'washType',
          'location',
          'licensePlate',
          'licensePlate.customer',
          'licensePlate.customer.subscription',
        ],
        order: {
          timestamp: 'DESC',
        },
        // Show soft-deleted relations
        withDeleted: true,
      },
    );
    if (transactions.items.length == 0) {
      throw new HttpException('No elements found', HttpStatus.NO_CONTENT);
    }
    return transactions;
  }

  async getAllTransactionsByUser(
    options: IPaginationOptions,
    customerId: number,
  ): Promise<Pagination<TransactionModel>> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.location', 'location')
      .leftJoinAndSelect('transaction.washType', 'washType')
      .leftJoinAndSelect('transaction.licensePlate', 'licensePlate')
      .leftJoinAndSelect('licensePlate.customer', 'customer')
      .orderBy('transaction.timestamp', 'DESC');

    queryBuilder.where('customer.id = :customerId', { customerId });

    return await paginate<TransactionModel>(queryBuilder, options);
  }

  async getFilteredTransactions(
    options: IPaginationOptions,
    queryValue: string,
    startDate: Date,
    endDate: Date,
    washType: string,
    location: string,
    customerType: string,
  ): Promise<Pagination<TransactionModel>> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.location', 'location')
      .leftJoinAndSelect('transaction.washType', 'washType')
      .leftJoinAndSelect('transaction.licensePlate', 'licensePlate')
      .leftJoinAndSelect('licensePlate.customer', 'customer')
      .leftJoinAndSelect('customer.subscription', 'subscription')
      .orderBy('transaction.timestamp', 'DESC');

    if (queryValue) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('LOWER(licensePlate.licensePlate) LIKE :licensePlate', {
            licensePlate: `%${queryValue}%`,
          }).orWhere('LOWER(customer.email) LIKE :email', {
            email: `%${queryValue}%`,
          });
        }),
      );
    }
    if (startDate && endDate) {
      queryBuilder.andWhere(
        'transaction.timestamp >= :startDate AND transaction.timestamp <= :endDate',
        {
          startDate: startDate,
          endDate: endDate,
        },
      );
    }
    if (washType) {
      queryBuilder.andWhere('LOWER(washType.name) LIKE :washType', {
        washType: `%${washType}%`,
      });
    }

    if (location) {
      queryBuilder.andWhere('LOWER(location.name) LIKE :location', {
        location: `%${location}%`,
      });
    }

    if (customerType) {
      queryBuilder.andWhere('LOWER(subscription.name) LIKE :customerType', {
        customerType: `%${customerType}%`,
      });
    }

    return await paginate<TransactionModel>(queryBuilder, options);
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
      // Show soft-deleted relations
      withDeleted: true,
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
