import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './service/location.service';
import { LocationController } from './controller/location.controller';
import { LocationRepository } from './repository/location.repository';
import { Location } from './entity/location.entity';
import { RenterModule } from '../renter/renter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), RenterModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService],
})
export class LocationModule {}
