import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '../../core/services/transaction/transaction.service';
import { TransactionEntity } from '../../infrastructure/entities/transaction.entity';
import { IotController } from './controllers/iot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [IotController],
  providers: [TransactionService],
})
export class IotModule {}
