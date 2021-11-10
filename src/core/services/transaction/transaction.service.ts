import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionModel } from '../../models/transaction.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  async getAllTransactions(): Promise<TransactionModel[]> {
    const transactions = await this.transactionRepository.find({
      relations: ['washtype', 'location', 'licenseplate'],
    });
    const transactionEntities: TransactionModel[] = JSON.parse(
      JSON.stringify(transactions),
    );
    return transactionEntities;
  }
}
