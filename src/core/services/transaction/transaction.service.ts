import {
  BadRequestException, ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { Brackets, Repository } from 'typeorm';
import { TransactionModel } from '../../models/transaction.model';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CustomerService } from "../customer/customer.service";
import { LicensePlateModel } from "../../models/licenseplate.model";
import { PlateDetectionDto } from 'src/api/dtos/plate-detection.dto';
import { LocationService } from "../location/location.service";
import { CreateTransactionDto } from "../../../api/dtos/create-transaction.dto";

@Injectable()
export class TransactionService {

  lastLicensePlateDetections: Map<number, string> = new Map();

  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private customerService: CustomerService,
    private locationService: LocationService,
  ) {}

  async getAllTransactionsByUser(
    options: IPaginationOptions,
    customerId: number,
  ): Promise<Pagination<TransactionModel>> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.location', 'location')
      .leftJoinAndSelect('transaction.washType', 'washType')
      .leftJoinAndSelect('transaction.licensePlate', 'licensePlate')
      .leftJoinAndSelect('transaction.customer', 'customer')
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
    if (id <= 0) {
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

  /**
   * Method for IoT device to register last detected license plate at specific location
   * @param dto with license plate number and ID of location it was detected at
   */
  newLicensePlateDetection(dto: PlateDetectionDto) {
    this.lastLicensePlateDetections.set(dto.locationID, dto.licensePlateNumber);
    return this.lastLicensePlateDetections.get(dto.locationID);
  }

  /**
   * Checks to see if last detected license plate matches
   * any of those registered to the customer, and if so, returns it
   * otherwise returns null to indicate no match
   * @param customerID
   * @return licensePlate matching last detection, or null
   */
  async getMatchingLicensePlateAtLocation(locationID: number, customerID: number): Promise<LicensePlateModel> {
    const customer = await this.customerService.getCustomer(customerID);
    await this.locationService.getLocation(locationID, customer.company.id); // throws exception if customer not allowed to access this location
    let foundLicensePlate: LicensePlateModel = null;
    customer.licensePlates.forEach((plate) => {
      if (plate.licensePlate === this.lastLicensePlateDetections.get(Number(locationID))) {
        foundLicensePlate = plate;
      }
    });
    return foundLicensePlate;
  }

  async createTransaction(dto: CreateTransactionDto, customerID: number): Promise<TransactionModel> {
    const customer = await this.customerService.getCustomer(customerID);
    const location = await this.locationService.getLocation(dto.location.id, customer.company.id); // throws exception if customer not allowed to access this location
    const washType = location.washTypes.find((washtype) => washtype.id === dto.washType.id);
    if (!washType) {
      throw new NotFoundException(`No washtype with ID ${dto.washType.id} on location with ID ${location.id}`);
    }
    if (dto.licensePlate) {
      const plate = customer.licensePlates.find((plate) => plate.id === dto.licensePlate.id);
      if (!plate) {
        throw new NotFoundException(`No license plate with ID ${dto.licensePlate.id} registered on customer`);
      }
      const foundPlate = await this.getMatchingLicensePlateAtLocation(dto.location.id, customerID);
      if (foundPlate == null || dto.licensePlate.id !== foundPlate.id) {
        throw new BadRequestException(`Transaction license plate does not match last detected license plate at ${location.name}`);
      }
    }
    const transaction = this.transactionRepository.create(dto);
    transaction.customer = customer;
    transaction.imageURL = 'tom';
    transaction.purchasePrice = washType.price;
    transaction.timestamp = new Date();
    await this.transactionRepository.save(transaction);
    return await this.getTransaction(transaction.id);
  }
}
