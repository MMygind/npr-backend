import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { ApiOperation } from '@nestjs/swagger';
import { PlateDetectionDto } from '../../dtos/plate-detection.dto';

@Controller('iot')
export class IotController {
  constructor(private service: TransactionService) {
  }

  @Post('/plateDetection')
  @ApiOperation({
    description: 'Update last detected license plate for location',
  })
  //Simulates IOT
  newLicensePlateDetection(@Body() dto: PlateDetectionDto) {
    return this.service.newLicensePlateDetection(dto);
  }
}
