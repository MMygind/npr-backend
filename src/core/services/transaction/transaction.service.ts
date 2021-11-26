import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { Like, Repository } from 'typeorm';
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
          id: 'ASC',
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

  async getFilteredTransactions(
    options: IPaginationOptions,
    queryValue: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Pagination<TransactionModel>> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.location', 'location')
      .leftJoinAndSelect('transaction.washType', 'washType')
      .leftJoinAndSelect('transaction.licensePlate', 'licensePlate')
      .leftJoinAndSelect('licensePlate.customer', 'customer')
      .leftJoinAndSelect('customer.subscription', 'subscription');

    if (queryValue !== null && startDate == null && endDate == null) {
      queryBuilder
        .where('LOWER(licensePlate.licensePlate) LIKE :licensePlate', {
          licensePlate: `%${queryValue}%`,
        })
        .orWhere('LOWER(customer.name) LIKE :name', {
          name: `%${queryValue}%`,
        })
        .orWhere('LOWER(washType.name) LIKE :washType', {
          washType: `%${queryValue}%`,
        })
        .orWhere('LOWER(location.name) LIKE :location', {
          location: `%${queryValue}%`,
        })
        .orWhere('LOWER(subscription.name) LIKE :subscription', {
          subscription: `%${queryValue}%`,
        });
    } else if (queryValue == null && startDate !== null && endDate !== null) {
      queryBuilder.where(
        'transaction.timestamp > :startDate AND transaction.timestamp < :endDate',
        {
          startDate: startDate,
          endDate: endDate,
        },
      );
      console.log(startDate);
      console.log(endDate);
    } else if (queryValue !== null && startDate !== null && endDate !== null) {
      queryBuilder
        .where('LOWER(licensePlate.licensePlate) LIKE :licensePlate', {
          licensePlate: `%${queryValue}%`,
        })
        .andWhere(
          'transaction.timestamp >= :startDate AND transaction.timestamp <= :endDate',
          {
            startDate: startDate,
            endDate: endDate,
          },
        )
        .orWhere('LOWER(customer.name) LIKE :name', {
          name: `%${queryValue}%`,
        })
        .andWhere(
          'transaction.timestamp >= :startDate AND transaction.timestamp <= :endDate',
          {
            startDate: startDate,
            endDate: endDate,
          },
        )
        .orWhere('LOWER(washType.name) LIKE :washType', {
          washType: `%${queryValue}%`,
        })
        .andWhere(
          'transaction.timestamp >= :startDate AND transaction.timestamp <= :endDate',
          {
            startDate: startDate,
            endDate: endDate,
          },
        )
        .orWhere('LOWER(location.name) LIKE :location', {
          location: `%${queryValue}%`,
        })
        .andWhere(
          'transaction.timestamp >= :startDate AND transaction.timestamp <= :endDate',
          {
            startDate: startDate,
            endDate: endDate,
          },
        )
        .orWhere('LOWER(subscription.name) LIKE :subscription', {
          subscription: `%${queryValue}%`,
        })
        .andWhere(
          'transaction.timestamp >= :startDate AND transaction.timestamp <= :endDate',
          {
            startDate: startDate,
            endDate: endDate,
          },
        );
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
